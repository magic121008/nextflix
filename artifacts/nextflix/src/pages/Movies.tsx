import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { ContentGrid } from "@/components/ContentGrid";
import { NoApiKey } from "@/components/NoApiKey";
import { hasApiKey, getPopularMovies, getTopRatedMovies, getNowPlayingMovies, getUpcomingMovies, getTrendingMovies } from "@/services/tmdb";

type MovieFilter = "popular" | "top_rated" | "now_playing" | "upcoming" | "trending";

const FILTERS: { key: MovieFilter; label: string }[] = [
  { key: "popular", label: "Popular" },
  { key: "trending", label: "Trending" },
  { key: "top_rated", label: "Top Rated" },
  { key: "now_playing", label: "Now Playing" },
  { key: "upcoming", label: "Upcoming" },
];

export default function Movies() {
  const [filter, setFilter] = useState<MovieFilter>("popular");
  const [page, setPage] = useState(1);

  if (!hasApiKey()) return <NoApiKey />;

  const fetchFn = {
    popular: getPopularMovies,
    top_rated: getTopRatedMovies,
    now_playing: getNowPlayingMovies,
    upcoming: getUpcomingMovies,
    trending: getTrendingMovies,
  }[filter];

  const { data, isLoading } = useQuery({
    queryKey: ["movies", filter, page],
    queryFn: () => fetchFn(page),
  });

  return (
    <Layout>
      <div className="pt-24 px-4 md:px-8 lg:px-12 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-white">Movies</h1>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => { setFilter(f.key); setPage(1); }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filter === f.key
                    ? "bg-netflix-red text-white"
                    : "bg-netflix-dark text-gray-300 hover:bg-gray-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <ContentGrid
          items={data?.results ?? []}
          mediaType="movie"
          isLoading={isLoading}
          page={page}
          totalPages={Math.min(data?.total_pages ?? 1, 20)}
          onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        />
      </div>
    </Layout>
  );
}
