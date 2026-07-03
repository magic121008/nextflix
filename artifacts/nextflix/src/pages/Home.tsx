import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { HeroBanner } from "@/components/HeroBanner";
import { ContentSlider } from "@/components/ContentSlider";
import { NoApiKey } from "@/components/NoApiKey";
import { hasApiKey, getTrending, getPopularMovies, getTopRatedMovies, getAnime, getPopularTV, getNowPlayingMovies, getUpcomingMovies } from "@/services/tmdb";
import type { TrendingItem } from "@/types/tmdb";

export default function Home() {
  if (!hasApiKey()) return <NoApiKey />;

  const { data: trending, isLoading: trendingLoading } = useQuery({
    queryKey: ["trending", "week"],
    queryFn: () => getTrending("week"),
  });

  const { data: popularMovies, isLoading: popularMoviesLoading } = useQuery({
    queryKey: ["movies", "popular"],
    queryFn: () => getPopularMovies(),
  });

  const { data: topRatedMovies, isLoading: topRatedLoading } = useQuery({
    queryKey: ["movies", "top-rated"],
    queryFn: () => getTopRatedMovies(),
  });

  const { data: popularTV, isLoading: popularTVLoading } = useQuery({
    queryKey: ["tv", "popular"],
    queryFn: () => getPopularTV(),
  });

  const { data: anime, isLoading: animeLoading } = useQuery({
    queryKey: ["anime", "popular"],
    queryFn: () => getAnime(),
  });

  const { data: nowPlaying, isLoading: nowPlayingLoading } = useQuery({
    queryKey: ["movies", "now-playing"],
    queryFn: () => getNowPlayingMovies(),
  });

  const { data: upcoming, isLoading: upcomingLoading } = useQuery({
    queryKey: ["movies", "upcoming"],
    queryFn: () => getUpcomingMovies(),
  });

  const heroItems = (trending?.results?.slice(0, 5) ?? []).filter(
    (item): item is TrendingItem & { media_type: "movie" | "tv" } =>
      item.media_type === "movie" || item.media_type === "tv"
  );

  return (
    <Layout>
      <HeroBanner items={heroItems} isLoading={trendingLoading} />

      <div className="mt-6">
        <ContentSlider
          title="Trending Now"
          items={(trending?.results ?? [])
            .filter((i): i is TrendingItem & { media_type: "movie" | "tv" } => i.media_type === "movie" || i.media_type === "tv")
            .map((i) => ({ ...i }))}
          mediaType="movie"
          isLoading={trendingLoading}
          viewAllLink="/trending"
        />

        <ContentSlider
          title="Popular Movies"
          items={popularMovies?.results ?? []}
          mediaType="movie"
          isLoading={popularMoviesLoading}
          viewAllLink="/movies"
        />

        <ContentSlider
          title="Popular TV Shows"
          items={popularTV?.results ?? []}
          mediaType="tv"
          isLoading={popularTVLoading}
          viewAllLink="/tv"
        />

        <ContentSlider
          title="Top Rated Movies"
          items={topRatedMovies?.results ?? []}
          mediaType="movie"
          isLoading={topRatedLoading}
          viewAllLink="/top-rated"
        />

        <ContentSlider
          title="Popular Anime"
          items={anime?.results ?? []}
          mediaType="tv"
          isLoading={animeLoading}
          viewAllLink="/anime"
        />

        <ContentSlider
          title="Now Playing"
          items={nowPlaying?.results ?? []}
          mediaType="movie"
          isLoading={nowPlayingLoading}
          viewAllLink="/latest"
        />

        <ContentSlider
          title="Upcoming Movies"
          items={upcoming?.results ?? []}
          mediaType="movie"
          isLoading={upcomingLoading}
        />
      </div>
    </Layout>
  );
}
