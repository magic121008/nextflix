import { useGetTrendingMovies, getGetTrendingMoviesQueryKey, useGetTrendingAnime, getGetTrendingAnimeQueryKey, useGetTrendingTv, getGetTrendingTvQueryKey } from "@workspace/api-client-react";
import { ContentCard } from "@/components/ui/content-card";
import { Loader2 } from "lucide-react";
import type { Content } from "@workspace/api-client-react/src/generated/api.schemas";

export default function Trending() {
  const { data: trendingMovies, isLoading: loadingMovies } = useGetTrendingMovies({ query: { queryKey: getGetTrendingMoviesQueryKey() }});
  const { data: trendingAnime, isLoading: loadingAnime } = useGetTrendingAnime({ query: { queryKey: getGetTrendingAnimeQueryKey() }});
  const { data: trendingTv, isLoading: loadingTv } = useGetTrendingTv({ query: { queryKey: getGetTrendingTvQueryKey() }});

  const isLoading = loadingMovies || loadingAnime || loadingTv;
  
  // Combine and sort by some metric or just interleave
  const allTrending: Content[] = [
    ...(trendingMovies || []),
    ...(trendingAnime || []),
    ...(trendingTv || [])
  ].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));

  return (
    <div className="pt-24 px-6 lg:px-12 pb-20 w-full min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white tracking-wide">Trending Now</h1>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {allTrending.map((item) => (
            <ContentCard key={`trending-${item.id}`} content={item} />
          ))}
        </div>
      )}
    </div>
  );
}
