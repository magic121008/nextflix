import { useGetCategories, getGetCategoriesQueryKey, useGetMovies, getGetMoviesQueryKey } from "@workspace/api-client-react";
import { useState } from "react";
import { ContentCard } from "@/components/ui/content-card";
import { Loader2 } from "lucide-react";

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  const { data: categories, isLoading: loadingCategories } = useGetCategories({ query: { queryKey: getGetCategoriesQueryKey() }});
  
  const { data: moviesData, isLoading: loadingMovies } = useGetMovies(
    { categoryId: selectedCategory, limit: 50 },
    { query: { enabled: selectedCategory !== null, queryKey: getGetMoviesQueryKey({ categoryId: selectedCategory, limit: 50 }) } }
  );

  return (
    <div className="pt-24 px-6 lg:px-12 pb-20 w-full min-h-screen flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-64 shrink-0 space-y-2">
        <h1 className="text-2xl font-bold text-white tracking-wide mb-6">Categories</h1>
        {loadingCategories ? (
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        ) : (
          <div className="flex flex-wrap md:flex-col gap-2">
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-left px-4 py-2 rounded transition-colors ${
                  selectedCategory === cat.id 
                    ? "bg-primary text-white font-bold" 
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex-1">
        {!selectedCategory ? (
          <div className="flex items-center justify-center h-64 text-gray-500 text-xl">
            Select a category to view content
          </div>
        ) : loadingMovies ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : moviesData?.items && moviesData.items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {moviesData.items.map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500 text-xl">
            No content found in this category
          </div>
        )}
      </div>
    </div>
  );
}
