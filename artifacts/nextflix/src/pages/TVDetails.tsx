import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Play, Plus, Check, Heart, Star, Calendar, ChevronLeft, Tv } from "lucide-react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { ContentSlider } from "@/components/ContentSlider";
import { NoApiKey } from "@/components/NoApiKey";
import { hasApiKey, getTVDetails, getImageUrl } from "@/services/tmdb";
import { formatDate, formatRating } from "@/utils/helpers";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/context/AuthContext";

export default function TVDetails() {
  const { id } = useParams<{ id: string }>();
  const tvId = Number(id);
  const { isAuthenticated } = useAuth();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { isInFavorites, toggleFavorite } = useFavorites();

  if (!hasApiKey()) return <NoApiKey />;

  const { data: show, isLoading, error } = useQuery({
    queryKey: ["tv", tvId],
    queryFn: () => getTVDetails(tvId),
    enabled: !isNaN(tvId),
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse">
          <div className="h-[60vh] bg-netflix-dark" />
          <div className="px-8 md:px-16 py-8 space-y-4">
            <div className="h-10 bg-netflix-dark rounded w-1/2" />
            <div className="h-4 bg-netflix-dark rounded w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !show) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-gray-400 text-xl">TV Show not found</p>
          <Link to="/tv" className="mt-4 text-netflix-red hover:underline">Browse TV Shows</Link>
        </div>
      </Layout>
    );
  }

  const inWatchlist = isInWatchlist(show.id, "tv");
  const inFavorites = isInFavorites(show.id, "tv");
  const watchlistItem = { id: show.id, media_type: "tv" as const, title: show.name, poster_path: show.poster_path, backdrop_path: show.backdrop_path, vote_average: show.vote_average, overview: show.overview, first_air_date: show.first_air_date };

  const trailer = show.videos?.results?.find((v) => v.type === "Trailer" && v.site === "YouTube");
  const credits = show.credits;
  const recommendations = show.recommendations;
  const similar = show.similar;

  return (
    <Layout>
      <div className="relative">
        <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          <img
            src={getImageUrl(show.backdrop_path || show.poster_path)}
            alt={show.name}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = `https://via.placeholder.com/1920x1080/141414/444?text=${encodeURIComponent(show.name)}`; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />
        </div>

        <div className="px-4 md:px-8 lg:px-16 -mt-32 relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <img
                src={getImageUrl(show.poster_path, "w500")}
                alt={show.name}
                className="w-44 md:w-56 rounded-lg shadow-2xl hidden md:block"
                onError={(e) => { (e.target as HTMLImageElement).src = `https://via.placeholder.com/300x450/181818/808080?text=${encodeURIComponent(show.name)}`; }}
              />
            </div>

            <div className="flex-1 pb-8">
              <Link to="/tv" className="flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-4 transition-colors w-fit">
                <ChevronLeft className="w-4 h-4" /> Back to TV Shows
              </Link>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-400/10 border border-blue-400/30 px-2 py-0.5 rounded">TV Show</span>
                {show.status && <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded">{show.status}</span>}
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-white mb-2">{show.name}</h1>
              {show.tagline && <p className="text-gray-400 italic mb-4">"{show.tagline}"</p>}

              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-semibold">{formatRating(show.vote_average)}</span>
                  <span className="text-gray-500">({show.vote_count?.toLocaleString()} votes)</span>
                </div>
                {show.number_of_seasons && (
                  <div className="flex items-center gap-1">
                    <Tv className="w-4 h-4 text-gray-400" />
                    {show.number_of_seasons} Season{show.number_of_seasons > 1 ? "s" : ""}
                  </div>
                )}
                {show.first_air_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {formatDate(show.first_air_date)}
                  </div>
                )}
              </div>

              {show.genres && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {show.genres.map((g) => (
                    <Link key={g.id} to={`/genres?id=${g.id}&type=tv`} className="px-3 py-1 bg-gray-800 hover:bg-netflix-red/30 text-gray-300 text-xs rounded-full transition-colors">{g.name}</Link>
                  ))}
                </div>
              )}

              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 max-w-2xl">{show.overview}</p>

              <div className="flex flex-wrap items-center gap-3 mb-8">
                {trailer && (
                  <Link
                    to={`/watch/trailer/tv/${show.id}`}
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

              {show.networks && show.networks.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-4">
                  {show.networks.map((n) => (
                    <span key={n.id} className="text-xs text-gray-400 bg-gray-800 px-3 py-1 rounded">{n.name}</span>
                  ))}
                </div>
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

          {recommendations && recommendations.results.length > 0 && (
            <ContentSlider
              title="Recommended"
              items={recommendations.results}
              mediaType="tv"
            />
          )}

          {similar && similar.results.length > 0 && (
            <ContentSlider
              title="Similar Shows"
              items={similar.results}
              mediaType="tv"
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
