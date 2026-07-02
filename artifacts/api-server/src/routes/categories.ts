import { Router } from "express";
import { db, categoriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../lib/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const cats = await db.select().from(categoriesTable).orderBy(categoriesTable.name);
    return res.json(cats);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  try {
    const { name, type, slug } = req.body;
    if (!name || !type) return res.status(400).json({ error: "name and type required" });
    const finalSlug = slug || name.toLowerCase().replace(/\s+/g, "-");
    const [cat] = await db.insert(categoriesTable).values({ name, type, slug: finalSlug }).returning();
    return res.status(201).json(cat);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [cat] = await db.update(categoriesTable).set(req.body).where(eq(categoriesTable.id, id)).returning();
    if (!cat) return res.status(404).json({ error: "Not found" });
    return res.json(cat);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
    return res.status(204).send();
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
