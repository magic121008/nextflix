import { useState } from "react";
import { Navigate } from "react-router-dom";
import { User, Mail, Calendar, Shield, Edit2, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useFavorites } from "@/hooks/useFavorites";
import { useContinueWatching } from "@/hooks/useContinueWatching";
import { formatDate } from "@/utils/helpers";

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const { watchlist } = useWatchlist();
  const { favorites } = useFavorites();
  const { continueWatching } = useContinueWatching();
  const [editName, setEditName] = useState(false);
  const [nameValue, setNameValue] = useState(user?.name ?? "");

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const stats = [
    { label: "Watchlist", value: watchlist.length, emoji: "📋" },
    { label: "Favorites", value: favorites.length, emoji: "❤️" },
    { label: "Continue Watching", value: continueWatching.length, emoji: "▶️" },
  ];

  return (
    <Layout>
      <div className="pt-24 px-4 md:px-8 lg:px-12 pb-12 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Profile</h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-netflix-dark rounded-xl p-6 mb-6"
        >
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-netflix-red rounded-full flex items-center justify-center text-white font-black text-3xl">
              {user?.avatar || user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              {editName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    className="bg-gray-800 border border-gray-600 text-white rounded px-3 py-1.5 text-lg font-bold outline-none focus:border-netflix-red"
                    autoFocus
                  />
                  <button onClick={() => setEditName(false)} className="p-1.5 bg-green-600 rounded text-white"><Check className="w-4 h-4" /></button>
                  <button onClick={() => { setEditName(false); setNameValue(user?.name ?? ""); }} className="p-1.5 bg-gray-700 rounded text-white"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                  <button onClick={() => setEditName(true)} className="p-1 text-gray-500 hover:text-white transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              {user?.role === "admin" && (
                <span className="inline-flex items-center gap-1 text-xs text-netflix-red bg-netflix-red/10 border border-netflix-red/30 px-2 py-0.5 rounded mt-1">
                  <Shield className="w-3 h-3" /> Admin
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-gray-300">
              <Mail className="w-4 h-4 text-gray-500" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>Member since {formatDate(user?.createdAt)}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <User className="w-4 h-4 text-gray-500" />
              <span className="capitalize">{user?.role}</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-netflix-dark rounded-xl p-4 text-center"
            >
              <div className="text-3xl mb-1">{stat.emoji}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
