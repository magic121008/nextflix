import { Router } from "express";
import { db, episodesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../lib/auth.js";

const router = Router();

router.get("/content/:contentId/episodes", async (req, res) => {
  try {
    const contentId = Number(req.params.contentId);
    const episodes = await db.select().from(episodesTable)
      .where(eq(episodesTable.contentId, contentId))
      .orderBy(asc(episodesTable.season), asc(episodesTable.episode));
    return res.json(episodes);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/content/:contentId/episodes", requireAdmin, async (req, res) => {
  try {
    const contentId = Number(req.params.contentId);
    const [episode] = await db.insert(episodesTable).values({ ...req.body, contentId }).returning();
    return res.status(201).json(episode);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/episodes/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [episode] = await db.update(episodesTable).set(req.body).where(eq(episodesTable.id, id)).returning();
    if (!episode) return res.status(404).json({ error: "Not found" });
    return res.json(episode);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/episodes/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(episodesTable).where(eq(episodesTable.id, id));
    return res.status(204).send();
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
