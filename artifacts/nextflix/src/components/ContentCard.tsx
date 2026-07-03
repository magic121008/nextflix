import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Plus, Check, Heart, Play } from "lucide-react";
import { getImageUrl } from "@/services/tmdb";
import { getTitle, getReleaseDate, formatYear, formatRating } from "@/utils/helpers";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/context/AuthContext";

interface ContentCardProps {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  vote_average: number;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  media_type: "movie" | "tv";
  genre_ids?: number[];
  size?: "sm" | "md" | "lg";
}

export function ContentCard({
  id,
  title,
  name,
  poster_path,
  backdrop_path,
  vote_average,
  overview,
  release_date,
  first_air_date,
  media_type,
  genre_ids = [],
  size = "md",
}: ContentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { isAuthenticated } = useAuth();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { isInFavorites, toggleFavorite } = useFavorites();

  const displayTitle = getTitle({ title, name });
  const releaseDate = getReleaseDate({ release_date, first_air_date });
  const detailPath = media_type === "movie" ? `/movie/${id}` : `/tv/${id}`;
  const inWatchlist = isInWatchlist(id, media_type);
  const inFavorites = isInFavorites(id, media_type);

  const watchlistItem = {
    id,
    media_type,
    title: displayTitle,
    poster_path,
    backdrop_path: backdrop_path ?? null,
    vote_average,
    overview,
    release_date,
    first_air_date,
  };

  const widthClass = size === "sm" ? "w-32 md:w-36" : size === "lg" ? "w-48 md:w-56" : "w-40 md:w-48";

  return (
    <motion.div
      className={`flex-shrink-0 ${widthClass} cursor-pointer group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={detailPath} className="block relative">
        <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-netflix-dark">
          <img
            src={getImageUrl(poster_path, "w300")}
            alt={displayTitle}
            className="w-full h-full object-cover transition-opacity duration-300"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://via.placeholder.com/300x450/181818/808080?text=${encodeURIComponent(displayTitle)}`;
            }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-2"
          >
            <p className="text-xs text-gray-300 line-clamp-3 mb-2">{overview}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-white font-medium">{formatRating(vote_average)}</span>
              </div>
              <span className="text-xs text-gray-400">{formatYear(releaseDate)}</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
          </motion.div>
        </div>
      </Link>

      {isAuthenticated && isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute mt-1 flex gap-1 z-10"
        >
          <button
            onClick={(e) => { e.stopPropagation(); toggleWatchlist(watchlistItem); }}
            className={`p-1.5 rounded-full transition-colors ${inWatchlist ? "bg-white text-black" : "bg-gray-700 hover:bg-gray-600 text-white"}`}
            title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
          >
            {inWatchlist ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(watchlistItem); }}
            className={`p-1.5 rounded-full transition-colors ${inFavorites ? "bg-netflix-red text-white" : "bg-gray-700 hover:bg-gray-600 text-white"}`}
            title={inFavorites ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Heart className={`w-3 h-3 ${inFavorites ? "fill-white" : ""}`} />
          </button>
        </motion.div>
      )}

      <div className="mt-2 px-0.5">
        <p className="text-sm text-white font-medium truncate">{displayTitle}</p>
        <p className="text-xs text-gray-500">{formatYear(releaseDate)}</p>
      </div>
    </motion.div>
  );
}
