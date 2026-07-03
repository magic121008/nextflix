import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { ContentGrid } from "@/components/ContentGrid";
import { NoApiKey } from "@/components/NoApiKey";
import { hasApiKey, getAnime, getAnimeMovies } from "@/services/tmdb";

type AnimeFilter = "series" | "movies";

export default function Anime() {
  const [filter, setFilter] = useState<AnimeFilter>("series");
  const [page, setPage] = useState(1);

  if (!hasApiKey()) return <NoApiKey />;

  const { data: series, isLoading: seriesLoading } = useQuery({
    queryKey: ["anime", "series", page],
    queryFn: () => getAnime(page),
    enabled: filter === "series",
  });

  const { data: movies, isLoading: moviesLoading } = useQuery({
    queryKey: ["anime", "movies", page],
    queryFn: () => getAnimeMovies(page),
    enabled: filter === "movies",
  });

  const data = filter === "series" ? series : movies;
  const isLoading = filter === "series" ? seriesLoading : moviesLoading;
  const mediaType = filter === "series" ? "tv" : "movie";

  return (
    <Layout>
      <div className="pt-24 px-4 md:px-8 lg:px-12 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Anime</h1>
            <p className="text-gray-400 text-sm mt-1">Japanese animation from TMDB</p>
          </div>
          <div className="flex gap-2">
            {(["series", "movies"] as AnimeFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setPage(1); }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                  filter === f ? "bg-netflix-red text-white" : "bg-netflix-dark text-gray-300 hover:bg-gray-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <ContentGrid
          items={data?.results ?? []}
          mediaType={mediaType}
          isLoading={isLoading}
          page={page}
          totalPages={Math.min(data?.total_pages ?? 1, 20)}
          onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        />
      </div>
    </Layout>
  );
}
