import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { ContentCard } from "./ContentCard";
import { SkeletonCard } from "./SkeletonCard";
import { Link } from "react-router-dom";

interface SliderItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  vote_average: number;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
}

interface ContentSliderProps {
  title: string;
  items: SliderItem[];
  mediaType: "movie" | "tv";
  isLoading?: boolean;
  viewAllLink?: string;
}

export function ContentSlider({ title, items, mediaType, isLoading = false, viewAllLink }: ContentSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!sliderRef.current) return;
    const scrollAmount = sliderRef.current.clientWidth * 0.75;
    sliderRef.current.scrollBy({ left: dir === "right" ? scrollAmount : -scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="mb-10 group/row">
      <div className="flex items-center justify-between mb-3 px-4 md:px-8 lg:px-12">
        <h2 className="text-lg md:text-xl font-bold text-white">{title}</h2>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="text-sm text-netflix-red hover:text-red-400 font-medium transition-colors flex items-center gap-1"
          >
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-r from-black/80 to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hover:from-black"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <motion.div
          ref={sliderRef}
          className="flex gap-3 overflow-x-auto hide-scrollbar px-4 md:px-8 lg:px-12 pb-2"
        >
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : items.map((item) => (
                <ContentCard
                  key={item.id}
                  {...item}
                  media_type={mediaType}
                />
              ))}
        </motion.div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-l from-black/80 to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hover:from-black"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
    </section>
  );
}
