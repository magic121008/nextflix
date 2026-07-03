import { motion } from "framer-motion";
import { ContentCard } from "./ContentCard";
import { SkeletonGrid } from "./SkeletonCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GridItem {
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

interface ContentGridProps {
  items: GridItem[];
  mediaType: "movie" | "tv";
  isLoading?: boolean;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function ContentGrid({
  items,
  mediaType,
  isLoading = false,
  page = 1,
  totalPages = 1,
  onPageChange,
}: ContentGridProps) {
  if (isLoading) return <SkeletonGrid />;

  return (
    <div>
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
          >
            <ContentCard {...item} media_type={mediaType} />
          </motion.div>
        ))}
      </motion.div>

      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="flex items-center gap-1 px-4 py-2 bg-netflix-dark hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm rounded-md transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let p: number;
              if (totalPages <= 5) p = i + 1;
              else if (page <= 3) p = i + 1;
              else if (page >= totalPages - 2) p = totalPages - 4 + i;
              else p = page - 2 + i;
              return (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`w-8 h-8 text-sm rounded-md transition-colors ${
                    p === page ? "bg-netflix-red text-white" : "bg-netflix-dark hover:bg-gray-700 text-gray-300"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="flex items-center gap-1 px-4 py-2 bg-netflix-dark hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm rounded-md transition-colors"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
