import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { ContentGrid } from "@/components/ContentGrid";
import { NoApiKey } from "@/components/NoApiKey";
import { hasApiKey, getTopRatedMovies, getTopRatedTV } from "@/services/tmdb";

type TopRatedFilter = "movies" | "tv";

export default function TopRated() {
  const [filter, setFilter] = useState<TopRatedFilter>("movies");
  const [page, setPage] = useState(1);

  if (!hasApiKey()) return <NoApiKey />;

  const { data: movies, isLoading: moviesLoading } = useQuery({
    queryKey: ["top-rated", "movies", page],
    queryFn: () => getTopRatedMovies(page),
    enabled: filter === "movies",
  });

  const { data: tv, isLoading: tvLoading } = useQuery({
    queryKey: ["top-rated", "tv", page],
    queryFn: () => getTopRatedTV(page),
    enabled: filter === "tv",
  });

  const data = filter === "movies" ? movies : tv;
  const isLoading = filter === "movies" ? moviesLoading : tvLoading;

  return (
    <Layout>
      <div className="pt-24 px-4 md:px-8 lg:px-12 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-white">Top Rated</h1>
          <div className="flex gap-2">
            {(["movies", "tv"] as TopRatedFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setPage(1); }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filter === f ? "bg-netflix-red text-white" : "bg-netflix-dark text-gray-300 hover:bg-gray-700"
                }`}
              >
                {f === "movies" ? "Movies" : "TV Shows"}
              </button>
            ))}
          </div>
        </div>

        <ContentGrid
          items={data?.results ?? []}
          mediaType={filter === "movies" ? "movie" : "tv"}
          isLoading={isLoading}
          page={page}
          totalPages={Math.min(data?.total_pages ?? 1, 20)}
          onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        />
      </div>
    </Layout>
  );
}
