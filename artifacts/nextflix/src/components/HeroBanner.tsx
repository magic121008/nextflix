import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "@/services/tmdb";
import { getTitle, getReleaseDate, formatYear, truncateText } from "@/utils/helpers";

interface HeroBannerItem {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  backdrop_path: string | null;
  poster_path?: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type: "movie" | "tv";
  genre_ids?: number[];
}

interface HeroBannerProps {
  items: HeroBannerItem[];
  isLoading?: boolean;
}

export function HeroBanner({ items, isLoading = false }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || items.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(items.length, 5));
    }, 6000);
    return () => clearInterval(timer);
  }, [items.length, isAutoPlaying]);

  const goTo = (idx: number) => {
    setCurrentIndex(idx);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prev = () => goTo((currentIndex - 1 + Math.min(items.length, 5)) % Math.min(items.length, 5));
  const next = () => goTo((currentIndex + 1) % Math.min(items.length, 5));

  if (isLoading || items.length === 0) {
    return <div className="relative w-full h-[70vh] bg-netflix-dark animate-pulse" />;
  }

  const displayItems = items.slice(0, 5);
  const current = displayItems[currentIndex];
  const displayTitle = getTitle(current);
  const detailPath = current.media_type === "movie" ? `/movie/${current.id}` : `/tv/${current.id}`;

  return (
    <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={getImageUrl(current.backdrop_path || current.poster_path || null)}
            alt={displayTitle}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/1920x1080/141414/444444?text=NEXTFLIX";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex flex-col justify-end h-full pb-20 px-8 md:px-16 max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-netflix-red uppercase tracking-widest bg-netflix-red/10 border border-netflix-red/30 px-2 py-0.5 rounded">
                {current.media_type === "movie" ? "Movie" : "TV Show"}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-yellow-400 font-semibold">{current.vote_average.toFixed(1)}</span>
              </div>
              <span className="text-sm text-gray-400">{formatYear(getReleaseDate(current))}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight tracking-tight">
              {displayTitle}
            </h1>

            <p className="text-sm md:text-base text-gray-300 mb-6 leading-relaxed max-w-xl">
              {truncateText(current.overview, 200)}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={`/watch/trailer/${current.media_type}/${current.id}`}
                className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black font-bold px-6 py-2.5 rounded-md transition-colors text-sm md:text-base"
              >
                <Play className="w-5 h-5 fill-black" />
                Watch Trailer
              </Link>
              <Link
                to={detailPath}
                className="flex items-center gap-2 bg-gray-500/50 hover:bg-gray-500/70 text-white font-bold px-6 py-2.5 rounded-md transition-colors text-sm md:text-base backdrop-blur-sm"
              >
                <Info className="w-5 h-5" />
                More Info
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {displayItems.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 p-2 rounded-full transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 p-2 rounded-full transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {displayItems.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "w-8 bg-netflix-red" : "w-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
