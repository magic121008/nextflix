import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { ContentGrid } from "@/components/ContentGrid";
import { NoApiKey } from "@/components/NoApiKey";
import { hasApiKey, getTrending } from "@/services/tmdb";
import type { TrendingItem } from "@/types/tmdb";

type TimeWindow = "day" | "week";

export default function Trending() {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("week");

  if (!hasApiKey()) return <NoApiKey />;

  const { data, isLoading } = useQuery({
    queryKey: ["trending", timeWindow],
    queryFn: () => getTrending(timeWindow),
  });

  const filteredItems: TrendingItem[] = (data?.results ?? []).filter((i) => i.media_type !== "person") as TrendingItem[];

  return (
    <Layout>
      <div className="pt-24 px-4 md:px-8 lg:px-12 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-white">Trending</h1>
          <div className="flex gap-2">
            {(["day", "week"] as TimeWindow[]).map((tw) => (
              <button
                key={tw}
                onClick={() => setTimeWindow(tw)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                  timeWindow === tw ? "bg-netflix-red text-white" : "bg-netflix-dark text-gray-300 hover:bg-gray-700"
                }`}
              >
                {tw === "day" ? "Today" : "This Week"}
              </button>
            ))}
          </div>
        </div>

        <ContentGrid
          items={filteredItems.map((i) => ({
            ...i,
            title: i.title || i.name,
            media_type: i.media_type as "movie" | "tv",
          }))}
          mediaType="movie"
          isLoading={isLoading}
        />
      </div>
    </Layout>
  );
}
