export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  genres?: Genre[];
  adult: boolean;
  original_language: string;
  video: boolean;
  runtime?: number;
  status?: string;
  tagline?: string;
  budget?: number;
  revenue?: number;
  production_countries?: { iso_3166_1: string; name: string }[];
  spoken_languages?: { english_name: string; name: string }[];
  belongs_to_collection?: { id: number; name: string; poster_path: string; backdrop_path: string } | null;
}

export interface TVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  genres?: Genre[];
  original_language: string;
  origin_country: string[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  tagline?: string;
  episode_run_time?: number[];
  networks?: { id: number; name: string; logo_path: string }[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
  known_for_department: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export type MediaType = "movie" | "tv" | "person";

export interface TrendingItem {
  id: number;
  media_type: MediaType;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  original_language: string;
}

export interface SearchResult {
  id: number;
  media_type: MediaType;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  popularity: number;
  genre_ids?: number[];
  original_language: string;
  profile_path?: string | null;
}

export interface WatchlistItem {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  addedAt: string;
}

export interface FavoriteItem extends WatchlistItem {}

export interface ContinueWatchingItem {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  progress: number;
  duration: number;
  watchedAt: string;
}

export interface CustomContent {
  id: string;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  media_type: "movie" | "tv";
  featured: boolean;
  createdAt: string;
}
