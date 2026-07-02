import { pgTable, serial, text, integer, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const contentTable = pgTable("content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(),
  posterUrl: text("poster_url"),
  bannerUrl: text("banner_url"),
  trailerUrl: text("trailer_url"),
  videoUrl: text("video_url"),
  year: integer("year"),
  rating: real("rating"),
  duration: integer("duration"),
  genres: text("genres").array(),
  categoryId: integer("category_id"),
  isTrending: boolean("is_trending").notNull().default(false),
  isFeatured: boolean("is_featured").notNull().default(false),
  viewCount: integer("view_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertContentSchema = createInsertSchema(contentTable).omit({ id: true, createdAt: true, viewCount: true });
export type InsertContent = z.infer<typeof insertContentSchema>;
export type ContentItem = typeof contentTable.$inferSelect;
