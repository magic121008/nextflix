import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Play, Plus, Check, Heart, Star, Clock, Calendar, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { ContentSlider } from "@/components/ContentSlider";
import { NoApiKey } from "@/components/NoApiKey";
import { hasApiKey, getMovieDetails, getImageUrl } from "@/services/tmdb";
import { formatDate, formatRuntime, formatRating } from "@/utils/helpers";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/context/AuthContext";

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);
  const { isAuthenticated } = useAuth();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { isInFavorites, toggleFavorite } = useFavorites();

  if (!hasApiKey()) return <NoApiKey />;

  const { data: movie, isLoading, error } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => getMovieDetails(movieId),
    enabled: !isNaN(movieId),
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse">
          <div className="h-[60vh] bg-netflix-dark" />
          <div className="px-8 md:px-16 py-8 space-y-4">
            <div className="h-10 bg-netflix-dark rounded w-1/2" />
            <div className="h-4 bg-netflix-dark rounded w-full" />
            <div className="h-4 bg-netflix-dark rounded w-3/4" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !movie) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-gray-400 text-xl">Movie not found</p>
          <Link to="/movies" className="mt-4 text-netflix-red hover:underline">Browse Movies</Link>
        </div>
      </Layout>
    );
  }

  const inWatchlist = isInWatchlist(movie.id, "movie");
  const inFavorites = isInFavorites(movie.id, "movie");
  const watchlistItem = { id: movie.id, media_type: "movie" as const, title: movie.title, poster_path: movie.poster_path, backdrop_path: movie.backdrop_path, vote_average: movie.vote_average, overview: movie.overview, release_date: movie.release_date };

  const trailer = (movie as unknown as { videos?: { results: { type: string; site: string; key: string }[] } }).videos?.results?.find((v) => v.type === "Trailer" && v.site === "YouTube");
  const credits = (movie as unknown as { credits?: { cast: { id: number; name: string; character: string; profile_path: string | null; order: number }[] } }).credits;
  const recommendations = (movie as unknown as { recommendations?: { results: unknown[] } }).recommendations;
  const similar = (movie as unknown as { similar?: { results: unknown[] } }).similar;

  return (
    <Layout>
      <div className="relative">
        <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          <img
            src={getImageUrl(movie.backdrop_path || movie.poster_path)}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = `https://via.placeholder.com/1920x1080/141414/444?text=${encodeURIComponent(movie.title)}`; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />
        </div>

        <div className="px-4 md:px-8 lg:px-16 -mt-32 relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <img
                src={getImageUrl(movie.poster_path, "w500")}
                alt={movie.title}
                className="w-44 md:w-56 rounded-lg shadow-2xl hidden md:block"
                onError={(e) => { (e.target as HTMLImageElement).src = `https://via.placeholder.com/300x450/181818/808080?text=${encodeURIComponent(movie.title)}`; }}
              />
            </div>

            <div className="flex-1 pb-8">
              <Link to="/movies" className="flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-4 transition-colors w-fit">
                <ChevronLeft className="w-4 h-4" /> Back to Movies
              </Link>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-netflix-red uppercase tracking-widest bg-netflix-red/10 border border-netflix-red/30 px-2 py-0.5 rounded">Movie</span>
                {movie.status && <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded">{movie.status}</span>}
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-white mb-2">{movie.title}</h1>
              {movie.tagline && <p className="text-gray-400 italic mb-4">"{movie.tagline}"</p>}

              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-semibold">{formatRating(movie.vote_average)}</span>
                  <span className="text-gray-500">({movie.vote_count?.toLocaleString()} votes)</span>
                </div>
                {movie.runtime && <div className="flex items-center gap-1"><Clock className="w-4 h-4 text-gray-400" />{formatRuntime(movie.runtime)}</div>}
                <div className="flex items-center gap-1"><Calendar className="w-4 h-4 text-gray-400" />{formatDate(movie.release_date)}</div>
              </div>

              {movie.genres && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genres.map((g) => (
                    <Link key={g.id} to={`/genres?id=${g.id}&type=movie`} className="px-3 py-1 bg-gray-800 hover:bg-netflix-red/30 text-gray-300 text-xs rounded-full transition-colors">{g.name}</Link>
                  ))}
                </div>
              )}

              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 max-w-2xl">{movie.overview}</p>

              <div className="flex flex-wrap items-center gap-3 mb-8">
                {trailer && (
                  <Link
                    to={`/watch/trailer/movie/${movie.id}`}
                    className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black font-bold px-6 py-2.5 rounded-md transition-colors"
                  >
                    <Play className="w-5 h-5 fill-black" /> Watch Trailer
                  </Link>
                )}
                {isAuthenticated && (
                  <>
                    <button
                      onClick={() => toggleWatchlist(watchlistItem)}
                      className={`flex items-center gap-2 border font-semibold px-4 py-2.5 rounded-md transition-colors text-sm ${
                        inWatchlist ? "bg-white/20 border-white text-white" : "border-gray-600 text-gray-300 hover:border-white hover:text-white"
                      }`}
                    >
                      {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      {inWatchlist ? "In Watchlist" : "Watchlist"}
                    </button>
                    <button
                      onClick={() => toggleFavorite(watchlistItem)}
                      className={`flex items-center gap-2 border font-semibold px-4 py-2.5 rounded-md transition-colors text-sm ${
                        inFavorites ? "bg-netflix-red border-netflix-red text-white" : "border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${inFavorites ? "fill-white" : ""}`} />
                      {inFavorites ? "Favorited" : "Favorite"}
                    </button>
                  </>
                )}
              </div>

              {movie.production_countries && movie.production_countries.length > 0 && (
                <p className="text-sm text-gray-500">
                  <span className="text-gray-400">Countries: </span>
                  {movie.production_countries.map((c) => c.name).join(", ")}
                </p>
              )}
            </div>
          </div>

          {credits && credits.cast.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8">
              <h2 className="text-xl font-bold text-white mb-4">Cast</h2>
              <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                {credits.cast.slice(0, 15).map((person) => (
                  <div key={person.id} className="flex-shrink-0 w-24 text-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-netflix-dark mb-2">
                      <img
                        src={person.profile_path ? getImageUrl(person.profile_path, "w300") : `https://via.placeholder.com/100x100/181818/808080?text=${encodeURIComponent(person.name.charAt(0))}`}
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-white text-xs font-medium leading-tight">{person.name}</p>
                    <p className="text-gray-500 text-xs leading-tight">{person.character}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {recommendations && (recommendations as { results: unknown[] }).results.length > 0 && (
            <ContentSlider
              title="Recommended"
              items={(recommendations as { results: { id: number; title?: string; name?: string; poster_path: string | null; backdrop_path?: string | null; vote_average: number; overview: string; release_date?: string; first_air_date?: string; genre_ids?: number[] }[] }).results}
              mediaType="movie"
            />
          )}

          {similar && (similar as { results: unknown[] }).results.length > 0 && (
            <ContentSlider
              title="Similar Movies"
              items={(similar as { results: { id: number; title?: string; name?: string; poster_path: string | null; backdrop_path?: string | null; vote_average: number; overview: string; release_date?: string; first_air_date?: string; genre_ids?: number[] }[] }).results}
              mediaType="movie"
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
