import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { ContentGrid } from "@/components/ContentGrid";
import { NoApiKey } from "@/components/NoApiKey";
import { hasApiKey, getPopularTV, getTopRatedTV, getOnAirTV, getTrendingTV } from "@/services/tmdb";

type TVFilter = "popular" | "top_rated" | "on_air" | "trending";

const FILTERS: { key: TVFilter; label: string }[] = [
  { key: "popular", label: "Popular" },
  { key: "trending", label: "Trending" },
  { key: "top_rated", label: "Top Rated" },
  { key: "on_air", label: "On Air" },
];

export default function TVShows() {
  const [filter, setFilter] = useState<TVFilter>("popular");
  const [page, setPage] = useState(1);

  if (!hasApiKey()) return <NoApiKey />;

  const fetchFn = {
    popular: getPopularTV,
    top_rated: getTopRatedTV,
    on_air: getOnAirTV,
    trending: getTrendingTV,
  }[filter];

  const { data, isLoading } = useQuery({
    queryKey: ["tv", filter, page],
    queryFn: () => fetchFn(page),
  });

  return (
    <Layout>
      <div className="pt-24 px-4 md:px-8 lg:px-12 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-white">TV Shows</h1>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => { setFilter(f.key); setPage(1); }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filter === f.key ? "bg-netflix-red text-white" : "bg-netflix-dark text-gray-300 hover:bg-gray-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <ContentGrid
          items={data?.results ?? []}
          mediaType="tv"
          isLoading={isLoading}
          page={page}
          totalPages={Math.min(data?.total_pages ?? 1, 20)}
          onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        />
      </div>
    </Layout>
  );
}
