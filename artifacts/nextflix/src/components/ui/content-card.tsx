import { Link, useLocation } from "wouter";
import { Play, Plus, ChevronDown, Check } from "lucide-react";
import type { Content } from "@workspace/api-client-react/src/generated/api.schemas";
import { Button } from "./button";
import { useAddToWatchlist, useRemoveFromWatchlist, useGetWatchlist, getGetWatchlistQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";

interface ContentCardProps {
  content: Content;
}

export function ContentCard({ content }: ContentCardProps) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  
  const { data: watchlistData } = useGetWatchlist({ 
    query: { 
      enabled: isAuthenticated,
      queryKey: getGetWatchlistQueryKey()
    } 
  });
  
  const inWatchlist = watchlistData?.some((item: any) => item.contentId === content.id) || false;
  
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;

    if (inWatchlist) {
      removeFromWatchlist.mutate(
        { contentId: content.id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getGetWatchlistQueryKey() });
          }
        }
      );
    } else {
      addToWatchlist.mutate(
        { data: { contentId: content.id } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getGetWatchlistQueryKey() });
          }
        }
      );
    }
  };

  return (
    <Link href={`/content/${content.id}`}>
      <div className="group relative rounded-md overflow-hidden aspect-[2/3] bg-gray-900 cursor-pointer transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl">
        <img
          src={content.posterUrl || "/images/poster-cyberpunk.png"}
          alt={content.title}
          className="w-full h-full object-cover transition-transform duration-300"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="text-white font-bold text-lg leading-tight mb-2">{content.title}</h3>
          
          <div className="flex items-center gap-2 text-xs font-medium text-gray-300 mb-3">
            <span className="text-green-500 font-bold">{content.rating ? `${(content.rating * 10).toFixed(0)}% Match` : "New"}</span>
            <span>{content.year}</span>
            <span className="px-1.5 py-0.5 border border-gray-600 rounded">
              {content.type.toUpperCase()}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              className="w-8 h-8 rounded-full bg-white text-black hover:bg-gray-200"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/watch/${content.id}`); }}
            >
              <Play className="w-4 h-4 fill-black ml-0.5" />
            </Button>
            {isAuthenticated && (
              <Button 
                size="icon" 
                variant="outline" 
                className="w-8 h-8 rounded-full border-gray-400 bg-black/50 text-white hover:border-white hover:bg-white/20"
                onClick={handleWatchlistToggle}
              >
                {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </Button>
            )}
            <div className="flex-1" />
            <Button size="icon" variant="outline" className="w-8 h-8 rounded-full border-gray-400 bg-black/50 text-white hover:border-white hover:bg-white/20">
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
