import axios from "axios";
import type {
  Movie,
  TVShow,
  Genre,
  Video,
  Credits,
  TMDBResponse,
  TrendingItem,
  SearchResult,
} from "@/types/tmdb";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string | undefined;
const BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
export const IMAGE_W500 = "https://image.tmdb.org/t/p/w500";
export const IMAGE_W300 = "https://image.tmdb.org/t/p/w300";

export const hasApiKey = (): boolean => Boolean(API_KEY && API_KEY.length > 0);

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "en-US",
  },
});

tmdb.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("TMDB API error:", err?.response?.status, err?.message);
    return Promise.reject(err);
  }
);

export const getImageUrl = (path: string | null, size: "original" | "w500" | "w300" = "original"): string => {
  if (!path) return "https://via.placeholder.com/500x750/141414/808080?text=No+Image";
  const base = size === "w500" ? IMAGE_W500 : size === "w300" ? IMAGE_W300 : IMAGE_BASE_URL;
  return `${base}${path}`;
};

export const getTrending = async (timeWindow: "day" | "week" = "week"): Promise<TMDBResponse<TrendingItem>> => {
  const res = await tmdb.get(`/trending/all/${timeWindow}`);
  return res.data;
};

export const getTrendingMovies = async (page = 1): Promise<TMDBResponse<Movie>> => {
  const res = await tmdb.get("/trending/movie/week", { params: { page } });
  return res.data;
};

export const getTrendingTV = async (page = 1): Promise<TMDBResponse<TVShow>> => {
  const res = await tmdb.get("/trending/tv/week", { params: { page } });
  return res.data;
};

export const getPopularMovies = async (page = 1): Promise<TMDBResponse<Movie>> => {
  const res = await tmdb.get("/movie/popular", { params: { page } });
  return res.data;
};

export const getTopRatedMovies = async (page = 1): Promise<TMDBResponse<Movie>> => {
  const res = await tmdb.get("/movie/top_rated", { params: { page } });
  return res.data;
};

export const getNowPlayingMovies = async (page = 1): Promise<TMDBResponse<Movie>> => {
  const res = await tmdb.get("/movie/now_playing", { params: { page } });
  return res.data;
};

export const getUpcomingMovies = async (page = 1): Promise<TMDBResponse<Movie>> => {
  const res = await tmdb.get("/movie/upcoming", { params: { page } });
  return res.data;
};

export const getLatestMovies = async (page = 1): Promise<TMDBResponse<Movie>> => {
  const res = await tmdb.get("/movie/now_playing", { params: { page } });
  return res.data;
};

export const getPopularTV = async (page = 1): Promise<TMDBResponse<TVShow>> => {
  const res = await tmdb.get("/tv/popular", { params: { page } });
  return res.data;
};

export const getTopRatedTV = async (page = 1): Promise<TMDBResponse<TVShow>> => {
  const res = await tmdb.get("/tv/top_rated", { params: { page } });
  return res.data;
};

export const getOnAirTV = async (page = 1): Promise<TMDBResponse<TVShow>> => {
  const res = await tmdb.get("/tv/on_the_air", { params: { page } });
  return res.data;
};

export const getAnime = async (page = 1): Promise<TMDBResponse<TVShow>> => {
  const res = await tmdb.get("/discover/tv", {
    params: {
      page,
      with_genres: 16,
      with_original_language: "ja",
      sort_by: "popularity.desc",
    },
  });
  return res.data;
};

export const getAnimeMovies = async (page = 1): Promise<TMDBResponse<Movie>> => {
  const res = await tmdb.get("/discover/movie", {
    params: {
      page,
      with_genres: 16,
      with_original_language: "ja",
      sort_by: "popularity.desc",
    },
  });
  return res.data;
};

export const getMovieDetails = async (id: number): Promise<Movie> => {
  const res = await tmdb.get(`/movie/${id}`, {
    params: { append_to_response: "videos,credits,recommendations,similar" },
  });
  return res.data;
};

export const getTVDetails = async (id: number): Promise<TVShow & { videos?: { results: Video[] }; credits?: Credits; recommendations?: TMDBResponse<TVShow>; similar?: TMDBResponse<TVShow> }> => {
  const res = await tmdb.get(`/tv/${id}`, {
    params: { append_to_response: "videos,credits,recommendations,similar" },
  });
  return res.data;
};

export const getMovieVideos = async (id: number): Promise<{ results: Video[] }> => {
  const res = await tmdb.get(`/movie/${id}/videos`);
  return res.data;
};

export const getTVVideos = async (id: number): Promise<{ results: Video[] }> => {
  const res = await tmdb.get(`/tv/${id}/videos`);
  return res.data;
};

export const getMovieCredits = async (id: number): Promise<Credits> => {
  const res = await tmdb.get(`/movie/${id}/credits`);
  return res.data;
};

export const getTVCredits = async (id: number): Promise<Credits> => {
  const res = await tmdb.get(`/tv/${id}/credits`);
  return res.data;
};

export const getMovieRecommendations = async (id: number, page = 1): Promise<TMDBResponse<Movie>> => {
  const res = await tmdb.get(`/movie/${id}/recommendations`, { params: { page } });
  return res.data;
};

export const getTVRecommendations = async (id: number, page = 1): Promise<TMDBResponse<TVShow>> => {
  const res = await tmdb.get(`/tv/${id}/recommendations`, { params: { page } });
  return res.data;
};

export const getSimilarMovies = async (id: number, page = 1): Promise<TMDBResponse<Movie>> => {
  const res = await tmdb.get(`/movie/${id}/similar`, { params: { page } });
  return res.data;
};

export const getSimilarTV = async (id: number, page = 1): Promise<TMDBResponse<TVShow>> => {
  const res = await tmdb.get(`/tv/${id}/similar`, { params: { page } });
  return res.data;
};

export const searchMulti = async (query: string, page = 1): Promise<TMDBResponse<SearchResult>> => {
  const res = await tmdb.get("/search/multi", { params: { query, page, include_adult: false } });
  return res.data;
};

export const searchMovies = async (query: string, page = 1): Promise<TMDBResponse<Movie>> => {
  const res = await tmdb.get("/search/movie", { params: { query, page } });
  return res.data;
};

export const searchTV = async (query: string, page = 1): Promise<TMDBResponse<TVShow>> => {
  const res = await tmdb.get("/search/tv", { params: { query, page } });
  return res.data;
};

export const getMovieGenres = async (): Promise<{ genres: Genre[] }> => {
  const res = await tmdb.get("/genre/movie/list");
  return res.data;
};

export const getTVGenres = async (): Promise<{ genres: Genre[] }> => {
  const res = await tmdb.get("/genre/tv/list");
  return res.data;
};

export const discoverByGenre = async (genreId: number, type: "movie" | "tv" = "movie", page = 1): Promise<TMDBResponse<Movie | TVShow>> => {
  const res = await tmdb.get(`/discover/${type}`, {
    params: { page, with_genres: genreId, sort_by: "popularity.desc" },
  });
  return res.data;
};

export default tmdb;
