import { Navigate, Link } from "react-router-dom";
import { Trash2, BookmarkX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { useWatchlist } from "@/hooks/useWatchlist";
import { getImageUrl } from "@/services/tmdb";
import { formatYear, formatRating } from "@/utils/helpers";
import { Star } from "lucide-react";

export default function Watchlist() {
  const { isAuthenticated } = useAuth();
  const { watchlist, removeFromWatchlist } = useWatchlist();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <Layout>
      <div className="pt-24 px-4 md:px-8 lg:px-12 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
            <p className="text-gray-400 text-sm mt-1">{watchlist.length} title{watchlist.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <BookmarkX className="w-16 h-16 text-gray-600 mb-4" />
            <p className="text-white text-xl font-semibold mb-2">Your watchlist is empty</p>
            <p className="text-gray-400 mb-6">Add movies and TV shows to watch later</p>
            <Link to="/" className="bg-netflix-red hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">
              Browse Content
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <AnimatePresence>
              {watchlist.map((item) => (
                <motion.div
                  key={`${item.id}-${item.media_type}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative bg-netflix-dark rounded-lg overflow-hidden"
                >
                  <Link to={item.media_type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`}>
                    <div className="aspect-[2/3] overflow-hidden">
                      <img
                        src={getImageUrl(item.poster_path, "w300")}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://via.placeholder.com/300x450/181818/808080?text=${encodeURIComponent(item.title)}`; }}
                      />
                    </div>
                  </Link>
                  <div className="p-3">
                    <Link to={item.media_type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`}>
                      <p className="text-white font-medium text-sm truncate hover:text-netflix-red transition-colors">{item.title}</p>
                    </Link>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-gray-400">{formatRating(item.vote_average)}</span>
                        <span className="text-xs text-gray-600 ml-1">{formatYear(item.release_date || item.first_air_date)}</span>
                      </div>
                      <button
                        onClick={() => removeFromWatchlist(item.id, item.media_type)}
                        className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                        title="Remove from watchlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded mt-1 inline-block ${item.media_type === "movie" ? "bg-netflix-red/20 text-netflix-red" : "bg-blue-500/20 text-blue-400"}`}>
                      {item.media_type === "movie" ? "Movie" : "TV"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </Layout>
  );
}
