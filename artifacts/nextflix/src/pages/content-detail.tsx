import { useParams } from "wouter";
import { useGetMovie, getGetMovieQueryKey, useGetAnimeById, getGetAnimeByIdQueryKey, useGetTvShow, getGetTvShowQueryKey, useAddToWatchlist, useRemoveFromWatchlist, useGetWatchlist, getGetWatchlistQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Play, Plus, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";

export default function ContentDetail() {
  const { id } = useParams();
  const contentId = parseInt(id || "0", 10);
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Try to fetch as movie, anime, or TV show
  // In a real app we'd know the type or have a unified get endpoint
  const { data: movie, isLoading: loadingMovie } = useGetMovie(contentId, { query: { enabled: !!contentId, retry: 1, queryKey: getGetMovieQueryKey(contentId) } });
  const { data: anime, isLoading: loadingAnime } = useGetAnimeById(contentId, { query: { enabled: !!contentId && !movie, retry: 1, queryKey: getGetAnimeByIdQueryKey(contentId) } });
  const { data: tvShow, isLoading: loadingTv } = useGetTvShow(contentId, { query: { enabled: !!contentId && !movie && !anime, retry: 1, queryKey: getGetTvShowQueryKey(contentId) } });

  const content = movie || anime || tvShow;
  const isLoading = loadingMovie && loadingAnime && loadingTv;

  const { data: watchlistData } = useGetWatchlist({ 
    query: { 
      enabled: isAuthenticated && !!content,
      queryKey: getGetWatchlistQueryKey()
    } 
  });
  
  const inWatchlist = watchlistData?.some((item: any) => item.contentId === content?.id) || false;
  
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  const handleWatchlistToggle = () => {
    if (!isAuthenticated || !content) return;

    if (inWatchlist) {
      removeFromWatchlist.mutate(
        { contentId: content.id },
        { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetWatchlistQueryKey() }) }
      );
    } else {
      addToWatchlist.mutate(
        { data: { contentId: content.id } },
        { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetWatchlistQueryKey() }) }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Content not found
      </div>
    );
  }

  return (
    <div className="w-full pb-20">
      <div className="relative w-full h-[70vh] flex items-end pb-12">
        <div className="absolute inset-0 z-0">
          <img
            src={content.bannerUrl || content.posterUrl || "/images/banner-action.png"}
            alt={content.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 px-6 lg:px-12 w-full max-w-4xl space-y-6">
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight drop-shadow-2xl">
            {content.title}
          </h1>
          
          <div className="flex items-center gap-4 text-sm font-medium text-gray-300">
            <span className="text-green-500 font-bold text-lg">{content.rating ? `${(content.rating * 10).toFixed(0)}% Match` : "New"}</span>
            <span className="text-lg">{content.year}</span>
            <span className="px-2 py-0.5 border border-gray-600 rounded text-xs font-bold tracking-wider">
              {content.type.toUpperCase()}
            </span>
            {content.duration && <span className="text-lg">{Math.floor(content.duration / 60)}h {content.duration % 60}m</span>}
          </div>

          <p className="text-xl text-gray-200 leading-relaxed max-w-3xl drop-shadow-md">
            {content.description}
          </p>
          
          <div className="flex items-center gap-4 pt-6">
            <Link href={`/watch/${content.id}`}>
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-6 rounded font-bold transition-all hover:scale-105">
                <Play className="w-6 h-6 mr-2 fill-black" />
                Play
              </Button>
            </Link>
            
            {isAuthenticated && (
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleWatchlistToggle}
                className="bg-black/50 text-white border-gray-400 hover:bg-white/20 hover:border-white text-lg px-8 py-6 rounded font-bold backdrop-blur-sm transition-all hover:scale-105"
              >
                {inWatchlist ? (
                  <>
                    <Check className="w-6 h-6 mr-2" />
                    In Watchlist
                  </>
                ) : (
                  <>
                    <Plus className="w-6 h-6 mr-2" />
                    Add to Watchlist
                  </>
                )}
              </Button>
            )}
          </div>
          
          {content.genres && content.genres.length > 0 && (
            <div className="pt-6 flex gap-2">
              <span className="text-gray-400">Genres:</span>
              <div className="flex gap-2">
                {content.genres.map(genre => (
                  <span key={genre} className="text-white hover:underline cursor-pointer">{genre}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
