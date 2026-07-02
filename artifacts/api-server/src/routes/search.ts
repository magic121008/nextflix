import { Router } from "express";
import { db, contentTable } from "@workspace/db";
import { ilike, or, eq, and } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    const type = req.query.type as string | undefined;

    if (!q) return res.json([]);

    const likeQ = `%${q}%`;
    const conditions = [
      ilike(contentTable.title, likeQ),
      ilike(contentTable.description, likeQ),
    ];

    let baseCondition = or(...conditions);
    if (type && ["movie", "anime", "tv"].includes(type)) {
      baseCondition = and(or(...conditions), eq(contentTable.type, type));
    }

    const results = await db.select().from(contentTable)
      .where(baseCondition)
      .limit(50);

    return res.json(results);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
