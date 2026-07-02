import { useGetLatestMovies, getGetLatestMoviesQueryKey } from "@workspace/api-client-react";
import { ContentCard } from "@/components/ui/content-card";
import { Loader2 } from "lucide-react";

export default function Latest() {
  const { data: latestMovies, isLoading } = useGetLatestMovies({ query: { queryKey: getGetLatestMoviesQueryKey() }});

  return (
    <div className="pt-24 px-6 lg:px-12 pb-20 w-full min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white tracking-wide">Latest Movies</h1>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {latestMovies?.map((item) => (
            <ContentCard key={item.id} content={item} />
          ))}
        </div>
      )}
    </div>
  );
}
