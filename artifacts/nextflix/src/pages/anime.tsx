import { useGetAnime, getGetAnimeQueryKey } from "@workspace/api-client-react";
import { ContentCard } from "@/components/ui/content-card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Anime() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetAnime(
    { page, limit: 20 },
    { query: { queryKey: getGetAnimeQueryKey({ page, limit: 20 }) } }
  );

  return (
    <div className="pt-24 px-6 lg:px-12 pb-20 w-full min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white tracking-wide">Anime</h1>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {data?.items?.map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
          </div>
          
          {data?.items && data.items.length > 0 && (
            <div className="mt-12 flex justify-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="bg-black text-white border-gray-600 hover:bg-gray-800 hover:text-white"
              >
                Previous
              </Button>
              <span className="flex items-center px-4 font-bold">{page}</span>
              <Button 
                variant="outline" 
                onClick={() => setPage(p => p + 1)}
                disabled={!data || page >= Math.ceil(data.total / data.limit)}
                className="bg-black text-white border-gray-600 hover:bg-gray-800 hover:text-white"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
