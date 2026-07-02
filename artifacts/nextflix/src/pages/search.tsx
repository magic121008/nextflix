import { useState } from "react";
import { useSearch, getSearchQueryKey } from "@workspace/api-client-react";
import { useDebounce } from "@/hooks/use-debounce";
import { ContentCard } from "@/components/ui/content-card";
import { Search as SearchIcon, Loader2 } from "lucide-react";

export default function Search() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  const { data: results, isLoading } = useSearch(
    { q: debouncedQuery || "a" }, // Provide default query so it doesn't fail
    { query: { enabled: !!debouncedQuery, queryKey: getSearchQueryKey({ q: debouncedQuery }) } }
  );

  return (
    <div className="pt-24 px-6 lg:px-12 pb-20 w-full min-h-screen">
      <div className="max-w-3xl mx-auto mb-12">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            type="text"
            placeholder="Search movies, TV shows, anime..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg pl-14 pr-6 py-4 text-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            autoFocus
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center mt-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : debouncedQuery ? (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-300">
            Search results for "{debouncedQuery}"
          </h2>
          {results && results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {results.map((item) => (
                <ContentCard key={item.id} content={item} />
              ))}
            </div>
          ) : (
            <div className="text-center mt-20 text-gray-400">
              <p className="text-xl">No results found for "{debouncedQuery}"</p>
              <p className="mt-2">Try searching for something else.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center mt-20 text-gray-500">
          <p className="text-xl">Type something to search</p>
        </div>
      )}
    </div>
  );
}
