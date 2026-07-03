import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ContentGrid } from "@/components/ContentGrid";
import { NoApiKey } from "@/components/NoApiKey";
import { hasApiKey, searchMulti } from "@/services/tmdb";
import type { SearchResult } from "@/types/tmdb";

type SearchFilter = "all" | "movie" | "tv";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(searchParams.get("q") ?? "");
  const [filter, setFilter] = useState<SearchFilter>("all");
  const query = searchParams.get("q") ?? "";

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  if (!hasApiKey()) return <NoApiKey />;

  const { data, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchMulti(query),
    enabled: query.length > 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue.trim() });
    }
  };

  const results: SearchResult[] = (data?.results ?? []).filter((r) => r.media_type !== "person");
  const filtered = filter === "all" ? results : results.filter((r) => r.media_type === filter);

  return (
    <Layout>
      <div className="pt-24 px-4 md:px-8 lg:px-12 pb-12">
        <h1 className="text-3xl font-bold text-white mb-6">Search</h1>

        <form onSubmit={handleSubmit} className="relative max-w-2xl mb-8">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search movies, TV shows, anime..."
            className="w-full bg-netflix-dark border border-gray-700 focus:border-netflix-red text-white rounded-lg pl-12 pr-4 py-3 outline-none transition-colors text-sm"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-netflix-red hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors"
          >
            Search
          </button>
        </form>

        {query && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-400 text-sm">
                {filtered.length} results for <span className="text-white font-medium">"{query}"</span>
              </p>
              <div className="flex gap-2">
                {(["all", "movie", "tv"] as SearchFilter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${
                      filter === f ? "bg-netflix-red text-white" : "bg-netflix-dark text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {f === "all" ? "All" : f === "movie" ? "Movies" : "TV Shows"}
                  </button>
                ))}
              </div>
            </div>

            <ContentGrid
              items={filtered.map((r) => ({
                id: r.id,
                title: r.title,
                name: r.name,
                poster_path: r.poster_path,
                backdrop_path: r.backdrop_path,
                vote_average: r.vote_average,
                overview: r.overview,
                release_date: r.release_date,
                first_air_date: r.first_air_date,
                genre_ids: r.genre_ids,
              }))}
              mediaType={filter === "tv" ? "tv" : "movie"}
              isLoading={isLoading}
            />
          </>
        )}

        {!query && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <SearchIcon className="w-16 h-16 text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">Search for your favorite movies, TV shows, and anime</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
