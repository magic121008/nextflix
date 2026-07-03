import { useLocalStorage } from "./useLocalStorage";
import type { CustomContent } from "@/types/tmdb";
import { generateId } from "@/utils/helpers";

export function useAdmin() {
  const [customContent, setCustomContent] = useLocalStorage<CustomContent[]>("nextflix_custom_content", []);
  const [featuredId, setFeaturedId] = useLocalStorage<string | null>("nextflix_featured_id", null);
  const [heroBannerId, setHeroBannerId] = useLocalStorage<string | null>("nextflix_hero_banner_id", null);

  const addContent = (data: Omit<CustomContent, "id" | "createdAt">) => {
    const newItem: CustomContent = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    setCustomContent((prev) => [newItem, ...prev]);
    return newItem;
  };

  const updateContent = (id: string, data: Partial<Omit<CustomContent, "id" | "createdAt">>) => {
    setCustomContent((prev) => prev.map((item) => (item.id === id ? { ...item, ...data } : item)));
  };

  const deleteContent = (id: string) => {
    setCustomContent((prev) => prev.filter((item) => item.id !== id));
    if (featuredId === id) setFeaturedId(null);
    if (heroBannerId === id) setHeroBannerId(null);
  };

  const setFeatured = (id: string | null) => setFeaturedId(id);
  const setHeroBanner = (id: string | null) => setHeroBannerId(id);

  const getFeatured = (): CustomContent | undefined => {
    if (!featuredId) return undefined;
    return customContent.find((c) => c.id === featuredId);
  };

  const getHeroBanner = (): CustomContent | undefined => {
    if (!heroBannerId) return undefined;
    return customContent.find((c) => c.id === heroBannerId);
  };

  return {
    customContent,
    featuredId,
    heroBannerId,
    addContent,
    updateContent,
    deleteContent,
    setFeatured,
    setHeroBanner,
    getFeatured,
    getHeroBanner,
  };
}
