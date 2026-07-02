import { Router } from "express";
import { db, watchlistTable, watchProgressTable, contentTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../lib/auth.js";
import type { Request } from "express";
import type { JwtPayload } from "../lib/auth.js";

const router = Router();

router.use(requireAuth);

function getUser(req: Request): JwtPayload {
  return (req as Request & { user: JwtPayload }).user;
}

// Watchlist
router.get("/", async (req, res) => {
  try {
    const user = getUser(req);
    const rows = await db.select().from(watchlistTable)
      .where(eq(watchlistTable.userId, user.id));
    const contentIds = rows.map(r => r.contentId);
    if (contentIds.length === 0) return res.json([]);
    const items = await db.select().from(contentTable)
      .where(
        contentIds.length === 1
          ? eq(contentTable.id, contentIds[0])
          : undefined
      );
    // Return only items that are in the watchlist
    const filtered = items.filter(i => contentIds.includes(i.id));
    return res.json(filtered);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const user = getUser(req);
    const { contentId } = req.body;
    if (!contentId) return res.status(400).json({ error: "contentId required" });
    const existing = await db.select().from(watchlistTable)
      .where(and(eq(watchlistTable.userId, user.id), eq(watchlistTable.contentId, contentId)))
      .limit(1);
    if (existing.length > 0) return res.status(201).json({ ok: true });
    await db.insert(watchlistTable).values({ userId: user.id, contentId });
    return res.status(201).json({ ok: true });
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:contentId", async (req, res) => {
  try {
    const user = getUser(req);
    const contentId = Number(req.params.contentId);
    await db.delete(watchlistTable)
      .where(and(eq(watchlistTable.userId, user.id), eq(watchlistTable.contentId, contentId)));
    return res.status(204).send();
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
