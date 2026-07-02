import { Router } from "express";
import { db, contentTable } from "@workspace/db";
import { eq, desc, ilike, or, and } from "drizzle-orm";
import { requireAdmin, requireAuth } from "../lib/auth.js";
import type { Request } from "express";
import type { JwtPayload } from "../lib/auth.js";

export function createContentRouter(type: "movie" | "anime" | "tv") {
  const router = Router();

  // List
  router.get("/", async (req, res) => {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
      const offset = (page - 1) * limit;
      const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;

      let query = db.select().from(contentTable).where(
        categoryId
          ? and(eq(contentTable.type, type), eq(contentTable.categoryId, categoryId))
          : eq(contentTable.type, type)
      ).orderBy(desc(contentTable.createdAt));

      const allItems = await query;
      const items = allItems.slice(offset, offset + limit);

      return res.json({ items, total: allItems.length, page, limit });
    } catch (err) {
      req.log?.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Trending
  router.get("/trending", async (req, res) => {
    try {
      const items = await db.select().from(contentTable)
        .where(and(eq(contentTable.type, type), eq(contentTable.isTrending, true)))
        .orderBy(desc(contentTable.viewCount))
        .limit(20);
      return res.json(items);
    } catch (err) {
      req.log?.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Latest (movies only)
  if (type === "movie") {
    router.get("/latest", async (req, res) => {
      try {
        const items = await db.select().from(contentTable)
          .where(eq(contentTable.type, "movie"))
          .orderBy(desc(contentTable.createdAt))
          .limit(20);
        return res.json(items);
      } catch (err) {
        req.log?.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }
    });
  }

  // Get by ID
  router.get("/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const [item] = await db.select().from(contentTable).where(
        and(eq(contentTable.id, id), eq(contentTable.type, type))
      ).limit(1);
      if (!item) return res.status(404).json({ error: "Not found" });
      // increment view count
      await db.update(contentTable).set({ viewCount: (item.viewCount || 0) + 1 }).where(eq(contentTable.id, id));
      return res.json(item);
    } catch (err) {
      req.log?.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create (admin)
  router.post("/", requireAdmin, async (req, res) => {
    try {
      const data = { ...req.body, type };
      const [item] = await db.insert(contentTable).values(data).returning();
      return res.status(201).json(item);
    } catch (err) {
      req.log?.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Update (admin)
  router.patch("/:id", requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const [item] = await db.update(contentTable).set(req.body).where(
        and(eq(contentTable.id, id), eq(contentTable.type, type))
      ).returning();
      if (!item) return res.status(404).json({ error: "Not found" });
      return res.json(item);
    } catch (err) {
      req.log?.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Delete (admin)
  router.delete("/:id", requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      await db.delete(contentTable).where(
        and(eq(contentTable.id, id), eq(contentTable.type, type))
      );
      return res.status(204).send();
    } catch (err) {
      req.log?.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}
