import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-netflix-black border-t border-gray-800 py-10 mt-16 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <p className="text-gray-500 text-sm mb-6">Questions? Contact us</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { links: [{ to: "/", label: "Home" }, { to: "/movies", label: "Movies" }, { to: "/tv", label: "TV Shows" }, { to: "/anime", label: "Anime" }] },
            { links: [{ to: "/trending", label: "Trending" }, { to: "/latest", label: "Latest" }, { to: "/popular", label: "Popular" }, { to: "/top-rated", label: "Top Rated" }] },
            { links: [{ to: "/search", label: "Search" }, { to: "/genres", label: "Genres" }, { to: "/watchlist", label: "Watchlist" }, { to: "/favorites", label: "Favorites" }] },
            { links: [{ to: "/profile", label: "Profile" }, { to: "/settings", label: "Settings" }, { to: "/login", label: "Sign In" }, { to: "/register", label: "Register" }] },
          ].map((col, i) => (
            <ul key={i} className="space-y-2">
              {col.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-netflix-red font-black text-xl">NEXTFLIX</p>
          <p className="text-gray-600 text-xs">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
        <p className="text-gray-700 text-xs mt-4">© {new Date().getFullYear()} NEXTFLIX. For educational purposes only.</p>
      </div>
    </footer>
  );
}
