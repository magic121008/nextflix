import { useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  Shield,
  Star,
  Check,
  X,
  Film,
  Tv,
  Image,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useFavorites } from "@/hooks/useFavorites";
import type { CustomContent } from "@/types/tmdb";

const EMPTY_FORM: Omit<CustomContent, "id" | "createdAt"> = {
  title: "",
  overview: "",
  poster_path: "",
  backdrop_path: "",
  vote_average: 7.5,
  release_date: new Date().toISOString().split("T")[0],
  genre_ids: [],
  media_type: "movie",
  featured: false,
};

export default function AdminDashboard() {
  const { isAuthenticated } = useAuth();
  const {
    customContent,
    addContent,
    updateContent,
    deleteContent,
    setFeatured,
    setHeroBanner,
    featuredId,
    heroBannerId,
  } = useAdmin();
  const { watchlist } = useWatchlist();
  const { favorites } = useFavorites();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [activeTab, setActiveTab] = useState<"content" | "stats">("content");

  const ADMIN_PASSWORD = "RK@2026#ADMIN";

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const hasAccess = sessionStorage.getItem("admin_access") === "true";

  if (!hasAccess) {
    const password = window.prompt("Enter Admin Password");

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_access", "true");
      window.location.reload();
      return null;
    }

    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.overview.trim()) return;
    if (editingId) {
      updateContent(editingId, form);
    } else {
      addContent(form);
    }
    setShowForm(false);
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
  };

  const startEdit = (item: CustomContent) => {
    const { id: _id, createdAt: _c, ...rest } = item;
    void _id;
    void _c;
    setForm(rest);
    setEditingId(item.id);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
  };

  const stats = [
    {
      label: "Custom Content",
      value: customContent.length,
      icon: Film,
      color: "text-netflix-red",
    },
    {
      label: "Watchlists",
      value: watchlist.length,
      icon: Tv,
      color: "text-blue-400",
    },
    {
      label: "Favorites",
      value: favorites.length,
      icon: Star,
      color: "text-yellow-400",
    },
    {
      label: "Featured Set",
      value: featuredId ? 1 : 0,
      icon: Image,
      color: "text-green-400",
    },
  ];

  return (
    <Layout>
      <div className="pt-24 px-4 md:px-8 lg:px-12 pb-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-netflix-red/20 rounded-lg">
            <Shield className="w-6 h-6 text-netflix-red" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm">
              Manage custom content and app settings
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-8">
          {(["content", "stats"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                activeTab === t
                  ? "bg-netflix-red text-white"
                  : "bg-netflix-dark text-gray-300 hover:bg-gray-700"
              }`}
            >
              {t === "content" ? "Custom Content" : "Statistics"}
            </button>
          ))}
        </div>

        {activeTab === "stats" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-netflix-dark rounded-xl p-5"
              >
                <s.icon className={`w-6 h-6 ${s.color} mb-3`} />
                <div className="text-3xl font-bold text-white">{s.value}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "content" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-400 text-sm">
                {customContent.length} custom items
              </p>
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingId(null);
                  setForm({ ...EMPTY_FORM });
                }}
                className="flex items-center gap-2 bg-netflix-red hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
              >
                <Plus className="w-4 h-4" /> Add Content
              </button>
            </div>

            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-netflix-dark rounded-xl p-6 mb-6 border border-gray-700"
                >
                  <h2 className="text-lg font-semibold text-white mb-4">
                    {editingId ? "Edit Content" : "Add New Content"}
                  </h2>
                  <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, title: e.target.value }))
                        }
                        placeholder="Content title"
                        required
                        className="w-full bg-gray-800 border border-gray-700 focus:border-netflix-red rounded-lg px-3 py-2.5 text-white text-sm outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 block mb-1">
                        Type
                      </label>
                      <select
                        value={form.media_type}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            media_type: e.target.value as "movie" | "tv",
                          }))
                        }
                        className="w-full bg-gray-800 border border-gray-700 focus:border-netflix-red rounded-lg px-3 py-2.5 text-white text-sm outline-none"
                      >
                        <option value="movie">Movie</option>
                        <option value="tv">TV Show</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs text-gray-400 block mb-1">
                        Overview *
                      </label>
                      <textarea
                        value={form.overview}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, overview: e.target.value }))
                        }
                        placeholder="Content description..."
                        required
                        rows={3}
                        className="w-full bg-gray-800 border border-gray-700 focus:border-netflix-red rounded-lg px-3 py-2.5 text-white text-sm outline-none transition-colors resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 block mb-1">
                        Poster URL
                      </label>
                      <input
                        type="url"
                        value={form.poster_path}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            poster_path: e.target.value,
                          }))
                        }
                        placeholder="https://..."
                        className="w-full bg-gray-800 border border-gray-700 focus:border-netflix-red rounded-lg px-3 py-2.5 text-white text-sm outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 block mb-1">
                        Backdrop URL
                      </label>
                      <input
                        type="url"
                        value={form.backdrop_path}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            backdrop_path: e.target.value,
                          }))
                        }
                        placeholder="https://..."
                        className="w-full bg-gray-800 border border-gray-700 focus:border-netflix-red rounded-lg px-3 py-2.5 text-white text-sm outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 block mb-1">
                        Rating (0–10)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={10}
                        step={0.1}
                        value={form.vote_average}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            vote_average: Number(e.target.value),
                          }))
                        }
                        className="w-full bg-gray-800 border border-gray-700 focus:border-netflix-red rounded-lg px-3 py-2.5 text-white text-sm outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 block mb-1">
                        Release Date
                      </label>
                      <input
                        type="date"
                        value={form.release_date}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            release_date: e.target.value,
                          }))
                        }
                        className="w-full bg-gray-800 border border-gray-700 focus:border-netflix-red rounded-lg px-3 py-2.5 text-white text-sm outline-none transition-colors"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={form.featured}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, featured: e.target.checked }))
                        }
                        className="accent-netflix-red"
                      />
                      <label
                        htmlFor="featured"
                        className="text-sm text-gray-300"
                      >
                        Mark as Featured
                      </label>
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={cancelForm}
                        className="flex items-center gap-1.5 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-4 py-2 bg-netflix-red hover:bg-red-700 text-white font-semibold text-sm rounded-lg transition-colors"
                      >
                        <Check className="w-4 h-4" />{" "}
                        {editingId ? "Save Changes" : "Add Content"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {customContent.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Film className="w-16 h-16 text-gray-600 mb-4" />
                <p className="text-white text-xl font-semibold mb-2">
                  No custom content
                </p>
                <p className="text-gray-400 mb-6">
                  Add movies or TV shows to feature them alongside TMDB content
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {customContent.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-netflix-dark rounded-xl p-4 flex items-center gap-4 border border-gray-800"
                  >
                    {item.poster_path ? (
                      <img
                        src={item.poster_path}
                        alt={item.title}
                        className="w-12 h-16 object-cover rounded flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-12 h-16 bg-gray-700 rounded flex-shrink-0 flex items-center justify-center">
                        <Film className="w-5 h-5 text-gray-500" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-medium truncate">
                          {item.title}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${item.media_type === "movie" ? "bg-netflix-red/20 text-netflix-red" : "bg-blue-500/20 text-blue-400"}`}
                        >
                          {item.media_type === "movie" ? "Movie" : "TV"}
                        </span>
                        {item.featured && (
                          <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400">
                            Featured
                          </span>
                        )}
                        {featuredId === item.id && (
                          <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                            Hero
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs mt-0.5 truncate">
                        {item.overview}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-yellow-400">
                          ★ {item.vote_average}
                        </span>
                        <span className="text-xs text-gray-600">
                          {item.release_date}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() =>
                          setFeatured(featuredId === item.id ? null : item.id)
                        }
                        className={`px-2 py-1.5 text-xs rounded transition-colors ${featuredId === item.id ? "bg-green-600 text-white" : "bg-gray-700 hover:bg-gray-600 text-gray-300"}`}
                        title="Set as Hero Banner"
                      >
                        Hero
                      </button>
                      <button
                        onClick={() =>
                          setHeroBanner(
                            heroBannerId === item.id ? null : item.id,
                          )
                        }
                        className={`px-2 py-1.5 text-xs rounded transition-colors ${heroBannerId === item.id ? "bg-yellow-600 text-white" : "bg-gray-700 hover:bg-gray-600 text-gray-300"}`}
                        title="Set as Featured"
                      >
                        Feature
                      </button>
                      <button
                        onClick={() => startEdit(item)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteContent(item.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
