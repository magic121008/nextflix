import { useState, useEffect } from "react";
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

const ADMIN_PASSWORD = "mohit@121008";

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
  const [checked, setChecked] = useState(false);

  const hasAccess = sessionStorage.getItem("admin_access") === "true";

  // ✅ FIX: prompt ko render se hata ke useEffect me dala
  useEffect(() => {
    if (isAuthenticated && !hasAccess) {
      const password = useEffect(() => {
        if (isAuthenticated && !hasAccess) {
          const password = window.prompt("Enter Admin Password");

          if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem("admin_access", "true");
          }
        }
      }, [isAuthenticated, hasAccess]);
      ("Enter Admin Password");

      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem("admin_access", "true");
        setChecked(true);
      } else {
        setChecked(false);
      }
    }
  }, [isAuthenticated, hasAccess]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!hasAccess && !checked) return null;
  if (!hasAccess && checked === false) return <Navigate to="/" replace />;

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
    const { id, createdAt, ...rest } = item;
    setForm(rest);
    setEditingId(id);
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
          <Shield className="w-6 h-6 text-netflix-red" />
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        </div>

        {/* बाकी UI same rahega (content + stats tabs + form + list) */}
        {/* tumhara original code yaha safe hai */}
      </div>
    </Layout>
  );
}
