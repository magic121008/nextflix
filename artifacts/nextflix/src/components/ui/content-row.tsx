import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Content } from "@workspace/api-client-react/src/generated/api.schemas";
import { ContentCard } from "./content-card";

interface ContentRowProps {
  title: string;
  items: Content[];
}

export function ContentRow({ title, items }: ContentRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-4 py-4 px-6 lg:px-12 relative group/row">
      <h2 className="text-2xl font-bold text-white tracking-wide">{title}</h2>
      <div className="relative">
        <button 
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-6 z-40 bg-black/60 hover:bg-black p-2 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity backdrop-blur"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
        
        <div 
          ref={rowRef}
          className="flex gap-4 overflow-x-auto py-4 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map(item => (
            <div key={item.id} className="flex-none w-[180px] sm:w-[220px] lg:w-[260px]">
              <ContentCard content={item} />
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-6 z-40 bg-black/60 hover:bg-black p-2 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity backdrop-blur"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      </div>
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
