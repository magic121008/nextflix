import { useLocalStorage } from "./useLocalStorage";
import type { WatchlistItem } from "@/types/tmdb";

export function useWatchlist() {
  const [watchlist, setWatchlist] = useLocalStorage<WatchlistItem[]>("nextflix_watchlist", []);

  const addToWatchlist = (item: Omit<WatchlistItem, "addedAt">) => {
    setWatchlist((prev) => {
      if (prev.find((w) => w.id === item.id && w.media_type === item.media_type)) return prev;
      return [{ ...item, addedAt: new Date().toISOString() }, ...prev];
    });
  };

  const removeFromWatchlist = (id: number, mediaType: "movie" | "tv") => {
    setWatchlist((prev) => prev.filter((w) => !(w.id === id && w.media_type === mediaType)));
  };

  const isInWatchlist = (id: number, mediaType: "movie" | "tv"): boolean => {
    return watchlist.some((w) => w.id === id && w.media_type === mediaType);
  };

  const toggleWatchlist = (item: Omit<WatchlistItem, "addedAt">) => {
    if (isInWatchlist(item.id, item.media_type)) {
      removeFromWatchlist(item.id, item.media_type);
    } else {
      addToWatchlist(item);
    }
  };

  return { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist, toggleWatchlist };
}
