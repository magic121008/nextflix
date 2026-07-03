import { useLocalStorage } from "./useLocalStorage";
import type { FavoriteItem } from "@/types/tmdb";

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<FavoriteItem[]>("nextflix_favorites", []);

  const addToFavorites = (item: Omit<FavoriteItem, "addedAt">) => {
    setFavorites((prev) => {
      if (prev.find((f) => f.id === item.id && f.media_type === item.media_type)) return prev;
      return [{ ...item, addedAt: new Date().toISOString() }, ...prev];
    });
  };

  const removeFromFavorites = (id: number, mediaType: "movie" | "tv") => {
    setFavorites((prev) => prev.filter((f) => !(f.id === id && f.media_type === mediaType)));
  };

  const isInFavorites = (id: number, mediaType: "movie" | "tv"): boolean => {
    return favorites.some((f) => f.id === id && f.media_type === mediaType);
  };

  const toggleFavorite = (item: Omit<FavoriteItem, "addedAt">) => {
    if (isInFavorites(item.id, item.media_type)) {
      removeFromFavorites(item.id, item.media_type);
    } else {
      addToFavorites(item);
    }
  };

  return { favorites, addToFavorites, removeFromFavorites, isInFavorites, toggleFavorite };
}
