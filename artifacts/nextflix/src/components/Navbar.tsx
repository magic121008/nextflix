import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Bell, ChevronDown, User, Settings, LogOut, Shield, X, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Movies", path: "/movies" },
  { label: "TV Shows", path: "/tv" },
  { label: "Anime", path: "/anime" },
  { label: "Trending", path: "/trending" },
  { label: "Latest", path: "/latest" },
  { label: "Genres", path: "/genres" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (showSearch) searchInputRef.current?.focus();
  }, [showSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-netflix-black shadow-lg" : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-8 lg:px-12 h-16">
        <div className="flex items-center gap-6 lg:gap-8">
          <Link to="/" className="text-netflix-red font-black text-2xl tracking-tighter flex-shrink-0">
            NEXTFLIX
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  isActive(link.path)
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <AnimatePresence>
            {showSearch && (
              <motion.form
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSearch}
                className="flex items-center bg-black/80 border border-gray-600 rounded overflow-hidden"
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search titles..."
                  className="bg-transparent text-white text-sm px-3 py-1.5 outline-none w-40 md:w-56"
                />
                <button
                  type="button"
                  onClick={() => { setShowSearch(false); setSearchQuery(""); }}
                  className="p-1.5 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <button
            onClick={() => setShowSearch((s) => !s)}
            className="p-2 text-gray-300 hover:text-white transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {isAuthenticated && (
            <button className="p-2 text-gray-300 hover:text-white transition-colors hidden md:block" aria-label="Notifications">
              <Bell className="w-5 h-5" />
            </button>
          )}

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu((s) => !s)}
                className="flex items-center gap-1.5 group"
              >
                <div className="w-8 h-8 bg-netflix-red rounded flex items-center justify-center text-white font-bold text-sm">
                  {user?.avatar || user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-300 group-hover:text-white transition-transform duration-200 hidden md:block" style={{ transform: showUserMenu ? "rotate(180deg)" : "rotate(0deg)" }} />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-52 bg-netflix-dark border border-gray-700 rounded-lg shadow-xl py-1 z-50"
                    onMouseLeave={() => setShowUserMenu(false)}
                  >
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-white font-medium text-sm">{user?.name}</p>
                      <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setShowUserMenu(false)}>
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <Link to="/watchlist" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setShowUserMenu(false)}>
                      <Bell className="w-4 h-4" /> My Watchlist
                    </Link>
                    <Link to="/favorites" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setShowUserMenu(false)}>
                      <Bell className="w-4 h-4" /> Favorites
                    </Link>
                    <Link to="/continue-watching" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setShowUserMenu(false)}>
                      <Bell className="w-4 h-4" /> Continue Watching
                    </Link>
                    <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setShowUserMenu(false)}>
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-netflix-red hover:bg-red-900/20 transition-colors" onClick={() => setShowUserMenu(false)}>
                        <Shield className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    <div className="border-t border-gray-700 mt-1">
                      <button
                        onClick={() => { logout(); setShowUserMenu(false); navigate("/"); }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-netflix-red hover:bg-red-700 text-white text-sm font-semibold px-4 py-1.5 rounded transition-colors"
            >
              Sign In
            </Link>
          )}

          <button
            className="lg:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setShowMobileMenu((s) => !s)}
            aria-label="Menu"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-netflix-black border-t border-gray-800 overflow-hidden"
          >
            <div className="px-4 py-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setShowMobileMenu(false)}
                  className={`block px-3 py-2.5 text-sm font-medium rounded transition-colors ${
                    isActive(link.path) ? "text-white bg-white/10" : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
