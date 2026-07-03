export const formatDate = (date: string | undefined): string => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

export const formatYear = (date: string | undefined): string => {
  if (!date) return "N/A";
  return new Date(date).getFullYear().toString();
};

export const formatRuntime = (minutes: number | undefined): string => {
  if (!minutes) return "N/A";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export const formatRating = (rating: number | undefined): string => {
  if (rating === undefined || rating === null) return "N/A";
  return rating.toFixed(1);
};

export const getTitle = (item: { title?: string; name?: string }): string => {
  return item.title || item.name || "Unknown";
};

export const getReleaseDate = (item: { release_date?: string; first_air_date?: string }): string => {
  return item.release_date || item.first_air_date || "";
};

export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

export const generateId = (): string => {
  return `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const debounce = <T extends (...args: unknown[]) => void>(fn: T, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
