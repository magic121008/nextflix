import { useGetTrendingMovies, getGetTrendingMoviesQueryKey, useGetTrendingAnime, getGetTrendingAnimeQueryKey, useGetTrendingTv, getGetTrendingTvQueryKey, useGetFeatured, getGetFeaturedQueryKey, useGetContinueWatching, getGetContinueWatchingQueryKey } from "@workspace/api-client-react";
import { HeroBanner } from "@/components/ui/hero-banner";
import { ContentRow } from "@/components/ui/content-row";
import { useAuth } from "@/lib/auth";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { data: featured } = useGetFeatured({ query: { queryKey: getGetFeaturedQueryKey() }});
  const { data: trendingMovies } = useGetTrendingMovies({ query: { queryKey: getGetTrendingMoviesQueryKey() }});
  const { data: trendingAnime } = useGetTrendingAnime({ query: { queryKey: getGetTrendingAnimeQueryKey() }});
  const { data: trendingTv } = useGetTrendingTv({ query: { queryKey: getGetTrendingTvQueryKey() }});
  const { data: continueWatching } = useGetContinueWatching({ query: { enabled: isAuthenticated, queryKey: getGetContinueWatchingQueryKey() }});
  
  const heroContent = featured?.[0] || trendingMovies?.[0] || trendingAnime?.[0];
  
  return (
    <div className="w-full pb-20">
      {heroContent && <HeroBanner content={heroContent} />}
      <div className="-mt-32 relative z-20 space-y-8">
        {continueWatching && continueWatching.length > 0 && (
          <ContentRow title="Continue Watching" items={continueWatching.map(cw => cw.content).filter(Boolean) as any} />
        )}
        <ContentRow title="Trending Movies" items={trendingMovies || []} />
        <ContentRow title="Trending TV Shows" items={trendingTv || []} />
        <ContentRow title="Trending Anime" items={trendingAnime || []} />
        <ContentRow title="Featured" items={featured || []} />
      </div>
    </div>
  );
}
