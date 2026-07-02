import { Router } from "express";
import { db, contentTable, usersTable } from "@workspace/db";
import { eq, count, sum, desc } from "drizzle-orm";
import { requireAdmin } from "../lib/auth.js";

const router = Router();

router.use(requireAdmin);

router.get("/stats", async (req, res) => {
  try {
    const [movies] = await db.select({ count: count() }).from(contentTable).where(eq(contentTable.type, "movie"));
    const [anime] = await db.select({ count: count() }).from(contentTable).where(eq(contentTable.type, "anime"));
    const [tv] = await db.select({ count: count() }).from(contentTable).where(eq(contentTable.type, "tv"));
    const [users] = await db.select({ count: count() }).from(usersTable);
    const [views] = await db.select({ total: sum(contentTable.viewCount) }).from(contentTable);
    const recentContent = await db.select().from(contentTable).orderBy(desc(contentTable.createdAt)).limit(5);

    return res.json({
      totalMovies: movies.count,
      totalAnime: anime.count,
      totalTvShows: tv.count,
      totalUsers: users.count,
      totalViews: Number(views.total) || 0,
      recentContent,
    });
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await db.select({
      id: usersTable.id,
      email: usersTable.email,
      name: usersTable.name,
      role: usersTable.role,
      avatar: usersTable.avatar,
      createdAt: usersTable.createdAt,
    }).from(usersTable).orderBy(desc(usersTable.createdAt));
    return res.json(users);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, role } = req.body;
    const [user] = await db.update(usersTable)
      .set({ name, role })
      .where(eq(usersTable.id, id))
      .returning({
        id: usersTable.id,
        email: usersTable.email,
        name: usersTable.name,
        role: usersTable.role,
        avatar: usersTable.avatar,
        createdAt: usersTable.createdAt,
      });
    if (!user) return res.status(404).json({ error: "Not found" });
    return res.json(user);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(usersTable).where(eq(usersTable.id, id));
    return res.status(204).send();
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
