import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const episodesTable = pgTable("episodes", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").notNull(),
  season: integer("season").notNull().default(1),
  episode: integer("episode").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  duration: integer("duration"),
  videoUrl: text("video_url"),
  thumbnailUrl: text("thumbnail_url"),
  airDate: text("air_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEpisodeSchema = createInsertSchema(episodesTable).omit({ id: true, createdAt: true });
export type InsertEpisode = z.infer<typeof insertEpisodeSchema>;
export type Episode = typeof episodesTable.$inferSelect;
