import { useGetWatchlist, getGetWatchlistQueryKey } from "@workspace/api-client-react";
import { ContentCard } from "@/components/ui/content-card";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function Watchlist() {
  const { isAuthenticated } = useAuth();
  
  const { data: watchlist, isLoading } = useGetWatchlist({ 
    query: { 
      enabled: isAuthenticated,
      queryKey: getGetWatchlistQueryKey()
    } 
  });

  return (
    <div className="pt-24 px-6 lg:px-12 pb-20 w-full min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white tracking-wide">My Watchlist</h1>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : watchlist && watchlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {watchlist.map((item: any) => (
            item.content && <ContentCard key={item.id} content={item.content} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 gap-4">
          <p className="text-2xl">Your watchlist is empty</p>
          <p>Add shows and movies to keep track of what you want to watch.</p>
        </div>
      )}
    </div>
  );
}
