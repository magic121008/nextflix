import { Link } from "wouter";
import { Search, User, LogOut, Clapperboard, Settings } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent transition-all duration-300">
      <div className="flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-primary font-black text-2xl tracking-tighter">
            NEXTFLIX
          </Link>
          <div className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-200">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/movies" className="hover:text-white transition-colors">Movies</Link>
            <Link href="/anime" className="hover:text-white transition-colors">Anime</Link>
            <Link href="/tv" className="hover:text-white transition-colors">TV Shows</Link>
            <Link href="/trending" className="hover:text-white transition-colors">Trending</Link>
            <Link href="/categories" className="hover:text-white transition-colors">Categories</Link>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/search" className="text-white hover:text-gray-300 transition-colors">
            <Search className="w-5 h-5" />
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link href="/admin" className="text-white hover:text-gray-300">
                  <Settings className="w-5 h-5" />
                </Link>
              )}
              <Link href="/watchlist" className="text-white hover:text-gray-300">
                <Clapperboard className="w-5 h-5" />
              </Link>
              <Link href="/profile" className="text-white hover:text-gray-300">
                <User className="w-5 h-5" />
              </Link>
              <button onClick={logout} className="text-white hover:text-gray-300">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="default" className="bg-primary text-white hover:bg-primary/90 font-semibold rounded">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
