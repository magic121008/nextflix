import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Trash2, AlertTriangle, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useFavorites } from "@/hooks/useFavorites";
import { useContinueWatching } from "@/hooks/useContinueWatching";

export default function Settings() {
  const { user, isAuthenticated, logout } = useAuth();
  const { watchlist } = useWatchlist();
  const { favorites } = useFavorites();
  const { continueWatching } = useContinueWatching();
  const [cleared, setCleared] = useState<string | null>(null);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const clearData = (key: string, label: string) => {
    localStorage.removeItem(key);
    setCleared(label);
    setTimeout(() => setCleared(null), 2500);
    window.location.reload();
  };

  const sections = [
    {
      title: "Account",
      items: [
        { label: "Name", value: user?.name },
        { label: "Email", value: user?.email },
        { label: "Role", value: user?.role === "admin" ? "Administrator" : "User" },
      ],
    },
  ];

  const dataActions = [
    { label: "Clear Watchlist", key: "nextflix_watchlist", count: watchlist.length },
    { label: "Clear Favorites", key: "nextflix_favorites", count: favorites.length },
    { label: "Clear Continue Watching", key: "nextflix_continue_watching", count: continueWatching.length },
  ];

  return (
    <Layout>
      <div className="pt-24 px-4 md:px-8 lg:px-12 pb-12 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

        {sections.map((section) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-netflix-dark rounded-xl p-6 mb-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">{section.title}</h2>
            <div className="space-y-3">
              {section.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">{item.label}</span>
                  <span className="text-white text-sm font-medium capitalize">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-netflix-dark rounded-xl p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-white mb-1">Data Management</h2>
          <p className="text-gray-500 text-sm mb-4">All data is stored locally in your browser.</p>

          {cleared && (
            <div className="flex items-center gap-2 bg-green-900/30 border border-green-700/50 rounded-lg px-3 py-2 mb-4">
              <Check className="w-4 h-4 text-green-400" />
              <p className="text-green-400 text-sm">{cleared} cleared successfully</p>
            </div>
          )}

          <div className="space-y-3">
            {dataActions.map((action) => (
              <div key={action.key} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <div>
                  <p className="text-white text-sm">{action.label}</p>
                  <p className="text-gray-500 text-xs">{action.count} item{action.count !== 1 ? "s" : ""}</p>
                </div>
                <button
                  onClick={() => clearData(action.key, action.label)}
                  disabled={action.count === 0}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-red-900/30 hover:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed text-gray-400 text-xs rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-netflix-dark rounded-xl p-6 border border-red-900/30"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-netflix-red" /> Danger Zone
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm">Sign Out</p>
              <p className="text-gray-500 text-xs">Sign out of your NEXTFLIX account</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-netflix-red hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
