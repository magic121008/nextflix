import { db, contentTable, episodesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

async function seedEpisodes() {
  const tvAndAnime = await db.select().from(contentTable)
    .where(eq(contentTable.type, "tv"));

  const animeList = await db.select().from(contentTable)
    .where(eq(contentTable.type, "anime"));

  const series = [...tvAndAnime, ...animeList];
  console.log(`Found ${series.length} TV/anime titles to seed episodes for.`);

  const episodeData: typeof episodesTable.$inferInsert[] = [];

  for (const show of series) {
    const seasons = show.type === "anime" ? 1 : 2;
    const episodesPerSeason = show.type === "anime" ? 12 : 8;

    for (let s = 1; s <= seasons; s++) {
      for (let e = 1; e <= episodesPerSeason; e++) {
        episodeData.push({
          contentId: show.id,
          season: s,
          episode: e,
          title: `S${s}:E${e} - ${show.title} Episode ${e}`,
          description: `Episode ${e} of Season ${s} of ${show.title}. Continues the story from the previous episode.`,
          duration: 40 + Math.floor(Math.random() * 20),
          videoUrl: show.videoUrl || null,
          thumbnailUrl: show.posterUrl || null,
          airDate: `${show.year || 2020}-${String(s).padStart(2, "0")}-${String(e * 3).padStart(2, "0")}`,
        });
      }
    }
  }

  if (episodeData.length === 0) {
    console.log("No series found to seed episodes for.");
    process.exit(0);
  }

  // Clear existing episodes first
  await db.delete(episodesTable);
  console.log("Cleared existing episodes.");

  // Batch insert
  const batchSize = 50;
  for (let i = 0; i < episodeData.length; i += batchSize) {
    const batch = episodeData.slice(i, i + batchSize);
    await db.insert(episodesTable).values(batch);
  }

  console.log(`Seeded ${episodeData.length} episodes for ${series.length} series.`);
  process.exit(0);
}

seedEpisodes().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
