import { Router } from "express";
import { db, watchProgressTable, contentTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth } from "../lib/auth.js";
import type { Request } from "express";
import type { JwtPayload } from "../lib/auth.js";

const router = Router();

router.use(requireAuth);

function getUser(req: Request): JwtPayload {
  return (req as Request & { user: JwtPayload }).user;
}

router.get("/", async (req, res) => {
  try {
    const user = getUser(req);
    const progresses = await db.select().from(watchProgressTable)
      .where(eq(watchProgressTable.userId, user.id))
      .orderBy(desc(watchProgressTable.updatedAt))
      .limit(20);

    const result = await Promise.all(progresses.map(async (p) => {
      const [content] = await db.select().from(contentTable).where(eq(contentTable.id, p.contentId)).limit(1);
      return { ...p, content: content || null };
    }));

    return res.json(result);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const user = getUser(req);
    const { contentId, progressSeconds, durationSeconds } = req.body;
    if (contentId === undefined) return res.status(400).json({ error: "contentId required" });

    const existing = await db.select().from(watchProgressTable)
      .where(and(eq(watchProgressTable.userId, user.id), eq(watchProgressTable.contentId, contentId)))
      .limit(1);

    let progress;
    if (existing.length > 0) {
      [progress] = await db.update(watchProgressTable)
        .set({ progressSeconds, durationSeconds, updatedAt: new Date() })
        .where(and(eq(watchProgressTable.userId, user.id), eq(watchProgressTable.contentId, contentId)))
        .returning();
    } else {
      [progress] = await db.insert(watchProgressTable)
        .values({ userId: user.id, contentId, progressSeconds, durationSeconds })
        .returning();
    }

    return res.json(progress);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
