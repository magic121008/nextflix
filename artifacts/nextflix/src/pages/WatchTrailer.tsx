import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Layout } from "@/components/Layout";
import { NoApiKey } from "@/components/NoApiKey";
import { hasApiKey, getMovieVideos, getTVVideos, getMovieDetails, getTVDetails } from "@/services/tmdb";
import type { Video } from "@/types/tmdb";

export default function WatchTrailer() {
  const { type, id } = useParams<{ type: "movie" | "tv"; id: string }>();
  const navigate = useNavigate();
  const contentId = Number(id);
  const isMovie = type === "movie";

  if (!hasApiKey()) return <NoApiKey />;

  const { data: videos, isLoading: videosLoading } = useQuery({
    queryKey: ["videos", type, contentId],
    queryFn: () => isMovie ? getMovieVideos(contentId) : getTVVideos(contentId),
    enabled: !isNaN(contentId),
  });

  const { data: details } = useQuery<{ title?: string; name?: string }>({
    queryKey: [type, contentId],
    queryFn: async () => {
      const data = await (isMovie ? getMovieDetails(contentId) : getTVDetails(contentId));
      return data as { title?: string; name?: string };
    },
    enabled: !isNaN(contentId),
  });

  const youtubeVideos: Video[] = (videos?.results ?? []).filter((v: Video) => v.site === "YouTube");
  const trailer = youtubeVideos.find((v) => v.type === "Trailer" && v.official) ?? youtubeVideos.find((v) => v.type === "Trailer") ?? youtubeVideos[0];

  const title = details ? (details.title ?? details.name ?? "Loading...") : "Loading...";

  if (videosLoading) {
    return (
      <Layout showFooter={false}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-netflix-red border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!trailer) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4 text-center">
          <div className="text-6xl">🎬</div>
          <h2 className="text-2xl font-bold text-white">No Trailer Available</h2>
          <p className="text-gray-400">No YouTube trailer found for this title.</p>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-netflix-dark hover:bg-gray-700 text-white px-6 py-2.5 rounded-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <div className="text-center">
          <p className="text-white font-semibold">{title}</p>
          <p className="text-gray-400 text-sm">{trailer.name}</p>
        </div>
        <a
          href={`https://www.youtube.com/watch?v=${trailer.key}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-gray-300 hover:text-white text-sm transition-colors"
        >
          YouTube <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0&modestbranding=1`}
            title={trailer.name}
            className="w-full h-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      {youtubeVideos.length > 1 && (
        <div className="px-4 md:px-8 py-4">
          <p className="text-gray-400 text-sm mb-3">More Videos</p>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
            {youtubeVideos.slice(0, 10).map((v) => (
              <Link
                key={v.id}
                to={`/watch/trailer/${type}/${id}`}
                className="flex-shrink-0 bg-netflix-dark hover:bg-gray-700 rounded px-3 py-2 text-xs text-gray-300 hover:text-white transition-colors max-w-[160px] truncate"
              >
                {v.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
