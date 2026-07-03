import { useLocalStorage } from "./useLocalStorage";
import type { ContinueWatchingItem } from "@/types/tmdb";

export function useContinueWatching() {
  const [continueWatching, setContinueWatching] = useLocalStorage<ContinueWatchingItem[]>(
    "nextflix_continue_watching",
    []
  );

  const updateProgress = (item: Omit<ContinueWatchingItem, "watchedAt">) => {
    setContinueWatching((prev) => {
      const filtered = prev.filter((c) => !(c.id === item.id && c.media_type === item.media_type));
      return [{ ...item, watchedAt: new Date().toISOString() }, ...filtered].slice(0, 20);
    });
  };

  const removeFromContinueWatching = (id: number, mediaType: "movie" | "tv") => {
    setContinueWatching((prev) => prev.filter((c) => !(c.id === id && c.media_type === mediaType)));
  };

  const getProgress = (id: number, mediaType: "movie" | "tv"): number => {
    const found = continueWatching.find((c) => c.id === id && c.media_type === mediaType);
    return found ? (found.progress / found.duration) * 100 : 0;
  };

  return { continueWatching, updateProgress, removeFromContinueWatching, getProgress };
}
