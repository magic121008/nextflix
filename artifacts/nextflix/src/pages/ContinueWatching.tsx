import { Navigate, Link } from "react-router-dom";
import { Trash2, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { useContinueWatching } from "@/hooks/useContinueWatching";
import { getImageUrl } from "@/services/tmdb";

export default function ContinueWatching() {
  const { isAuthenticated } = useAuth();
  const { continueWatching, removeFromContinueWatching } = useContinueWatching();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <Layout>
      <div className="pt-24 px-4 md:px-8 lg:px-12 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Continue Watching</h1>
          <p className="text-gray-400 text-sm mt-1">{continueWatching.length} title{continueWatching.length !== 1 ? "s" : ""}</p>
        </div>

        {continueWatching.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Play className="w-16 h-16 text-gray-600 mb-4" />
            <p className="text-white text-xl font-semibold mb-2">Nothing to continue</p>
            <p className="text-gray-400 mb-6">Start watching something to track your progress here</p>
            <Link to="/" className="bg-netflix-red hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">
              Browse Content
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {continueWatching.map((item) => {
                const progressPct = item.duration > 0 ? Math.min((item.progress / item.duration) * 100, 100) : 0;
                return (
                  <motion.div
                    key={`${item.id}-${item.media_type}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group relative bg-netflix-dark rounded-lg overflow-hidden"
                  >
                    <Link to={item.media_type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`}>
                      <div className="aspect-video overflow-hidden relative">
                        <img
                          src={getImageUrl(item.backdrop_path || item.poster_path, "w500")}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { (e.target as HTMLImageElement).src = `https://via.placeholder.com/500x281/181818/808080?text=${encodeURIComponent(item.title)}`; }}
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                            <Play className="w-6 h-6 text-white fill-white" />
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                          <div className="h-full bg-netflix-red transition-all" style={{ width: `${progressPct}%` }} />
                        </div>
                      </div>
                    </Link>
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm truncate">{item.title}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{Math.round(progressPct)}% watched</p>
                        </div>
                        <button
                          onClick={() => removeFromContinueWatching(item.id, item.media_type)}
                          className="p-1 text-gray-500 hover:text-red-400 transition-colors flex-shrink-0"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </Layout>
  );
}
