import { Router } from "express";
import { db, contentTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const items = await db.select().from(contentTable)
      .where(eq(contentTable.isFeatured, true))
      .orderBy(desc(contentTable.viewCount))
      .limit(10);
    return res.json(items);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
