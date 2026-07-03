import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

const Home = lazy(() => import("@/pages/Home"));
const Movies = lazy(() => import("@/pages/Movies"));
const TVShows = lazy(() => import("@/pages/TVShows"));
const Anime = lazy(() => import("@/pages/Anime"));
const Trending = lazy(() => import("@/pages/Trending"));
const Latest = lazy(() => import("@/pages/Latest"));
const Popular = lazy(() => import("@/pages/Popular"));
const TopRated = lazy(() => import("@/pages/TopRated"));
const Search = lazy(() => import("@/pages/Search"));
const MovieDetails = lazy(() => import("@/pages/MovieDetails"));
const TVDetails = lazy(() => import("@/pages/TVDetails"));
const WatchTrailer = lazy(() => import("@/pages/WatchTrailer"));
const Genres = lazy(() => import("@/pages/Genres"));
const Profile = lazy(() => import("@/pages/Profile"));
const Watchlist = lazy(() => import("@/pages/Watchlist"));
const Favorites = lazy(() => import("@/pages/Favorites"));
const ContinueWatching = lazy(() => import("@/pages/ContinueWatching"));
const Settings = lazy(() => import("@/pages/Settings"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function PageLoader() {
  return (
    <div className="min-h-screen bg-netflix-black flex items-center justify-center">
      <div className="text-center">
        <div className="text-netflix-red font-black text-4xl mb-4">NEXTFLIX</div>
        <div className="w-8 h-8 border-2 border-netflix-red border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/tv" element={<TVShows />} />
        <Route path="/anime" element={<Anime />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/latest" element={<Latest />} />
        <Route path="/popular" element={<Popular />} />
        <Route path="/top-rated" element={<TopRated />} />
        <Route path="/search" element={<Search />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/tv/:id" element={<TVDetails />} />
        <Route path="/watch/trailer/:type/:id" element={<WatchTrailer />} />
        <Route path="/genres" element={<Genres />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/continue-watching" element={<ContinueWatching />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
