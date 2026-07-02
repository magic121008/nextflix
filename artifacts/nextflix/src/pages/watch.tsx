import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import {
  useGetMovie, getGetMovieQueryKey,
  useGetAnimeById, getGetAnimeByIdQueryKey,
  useGetTvShow, getGetTvShowQueryKey,
  useGetRelatedMovies, getGetRelatedMoviesQueryKey,
  useGetRelatedAnime, getGetRelatedAnimeQueryKey,
  useGetRelatedTv, getGetRelatedTvQueryKey,
  useGetTrendingMovies, getGetTrendingMoviesQueryKey,
  useGetTrendingAnime, getGetTrendingAnimeQueryKey,
  useGetTrendingTv, getGetTrendingTvQueryKey,
  useGetLatestMovies, getGetLatestMoviesQueryKey,
  useGetContinueWatching, getGetContinueWatchingQueryKey,
  useUpdateWatchProgress,
  useGetEpisodes, getGetEpisodesQueryKey,
} from "@workspace/api-client-react";
import type { Content, Episode } from "@workspace/api-client-react";
import {
  ArrowLeft, Loader2, Play, Pause, Maximize, Minimize,
  Volume2, VolumeX, Settings, ChevronLeft, ChevronRight,
  Star, Clock, Calendar, SkipForward, ToggleLeft, ToggleRight,
  PlayCircle,
} from "lucide-react";
import Hls from "hls.js";
import { useAuth } from "@/lib/auth";
import { ContentCard } from "@/components/ui/content-card";
import { ContentRow } from "@/components/ui/content-row";

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatDuration(mins: number) {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function StarRating({ rating }: { rating: number }) {
  const stars = Math.round(rating * 5);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < stars ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
        />
      ))}
      <span className="text-sm text-gray-400 ml-1">{(rating * 10).toFixed(1)}/10</span>
    </div>
  );
}

function VideoPlayer({
  videoUrl,
  title,
  contentId,
  isAuthenticated,
  onEnded,
  onProgress,
}: {
  videoUrl: string;
  title: string;
  contentId: number;
  isAuthenticated: boolean;
  onEnded?: () => void;
  onProgress?: (current: number, duration: number) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const updateProgress = useUpdateWatchProgress();

  const scheduleHideControls = useCallback(() => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setShowControls(false);
    }, 3000);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    setIsLoading(true);
    setIsPlaying(false);
    setProgress(0);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const play = () => {
      video.play().catch(() => {});
    };

    if (videoUrl.includes('<iframe')) return;

    if (videoUrl.endsWith(".m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true });
        hlsRef.current = hls;
        hls.loadSource(videoUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, play);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoUrl;
        video.addEventListener("loadedmetadata", play, { once: true });
      }
    } else {
      video.src = videoUrl;
      video.addEventListener("loadedmetadata", play, { once: true });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoUrl]);

  useEffect(() => {
    if (!isAuthenticated || !contentId) return;
    const interval = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused && duration > 0) {
        const cur = Math.floor(videoRef.current.currentTime);
        updateProgress.mutate({
          data: { contentId, progressSeconds: cur, durationSeconds: Math.floor(duration) },
        });
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated, contentId, duration, updateProgress]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) videoRef.current.play().catch(() => {});
    else videoRef.current.pause();
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    if (videoRef.current) videoRef.current.volume = v;
    setVolume(v);
    setIsMuted(v === 0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * duration;
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    const container = videoRef.current.closest(".player-container") as HTMLElement;
    if (!document.fullscreenElement) {
      container?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  };

  const skipForward = () => {
    if (videoRef.current) videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    scheduleHideControls();
  };

  if (videoUrl.includes('<iframe')) {
    return (
      <div className="relative w-full aspect-video bg-black">
        <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: videoUrl }} />
      </div>
    );
  }

  return (
    <div
      className="player-container relative w-full aspect-video bg-black group overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => videoRef.current && !videoRef.current.paused && setShowControls(false)}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/60">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={() => {
          if (!videoRef.current) return;
          const cur = videoRef.current.currentTime;
          const dur = videoRef.current.duration;
          if (dur > 0) setProgress((cur / dur) * 100);
          onProgress?.(cur, dur);
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration);
          setIsLoading(false);
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={onEnded}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        playsInline
      />

      <div className={`absolute inset-0 pointer-events-none bg-gradient-to-t from-black/90 via-transparent to-black/50 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`} />

      <div className={`absolute inset-x-0 bottom-0 p-4 md:p-6 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}>
        <p className="text-white text-sm md:text-lg font-semibold mb-3 drop-shadow">{title}</p>

        <div
          className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer mb-4 relative group/seek"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-red-600 rounded-full relative transition-all"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-red-600 rounded-full shadow opacity-0 group-hover/seek:opacity-100 translate-x-1/2" />
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <button onClick={togglePlay} className="text-white hover:text-gray-300 transition-colors">
            {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7" />}
          </button>
          <button onClick={skipForward} className="text-white hover:text-gray-300 transition-colors">
            <SkipForward className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 group/vol">
            <button onClick={toggleMute} className="text-white hover:text-gray-300 transition-colors">
              {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 md:w-24 accent-white hidden group-hover/vol:block"
            />
          </div>
          <span className="text-white text-xs md:text-sm font-mono select-none">
            {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
          </span>
          <div className="flex-1" />
          <button className="text-white hover:text-gray-300 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button onClick={toggleFullscreen} className="text-white hover:text-gray-300 transition-colors">
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {!isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </div>
        </div>
      )}
    </div>
  );
}

function EpisodePanel({
  episodes,
  currentEpisodeId,
  onSelectEpisode,
  autoPlayNext,
  onToggleAutoPlay,
}: {
  episodes: Episode[];
  currentEpisodeId: number | null;
  onSelectEpisode: (ep: Episode) => void;
  autoPlayNext: boolean;
  onToggleAutoPlay: () => void;
}) {
  const seasons = Array.from(new Set(episodes.map(e => e.season))).sort((a, b) => a - b);
  const [activeSeason, setActiveSeason] = useState(seasons[0] || 1);
  const seasonEps = episodes.filter(e => e.season === activeSeason);

  return (
    <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h3 className="text-white font-bold text-lg">Episodes</h3>
        <button
          onClick={onToggleAutoPlay}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          {autoPlayNext ? (
            <ToggleRight className="w-5 h-5 text-red-500" />
          ) : (
            <ToggleLeft className="w-5 h-5" />
          )}
          Auto-play next
        </button>
      </div>

      {seasons.length > 1 && (
        <div className="flex gap-2 px-4 py-3 border-b border-white/10 overflow-x-auto">
          {seasons.map(s => (
            <button
              key={s}
              onClick={() => setActiveSeason(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeSeason === s
                  ? "bg-white text-black"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              Season {s}
            </button>
          ))}
        </div>
      )}

      <div className="divide-y divide-white/5 max-h-96 overflow-y-auto">
        {seasonEps.map(ep => (
          <button
            key={ep.id}
            onClick={() => onSelectEpisode(ep)}
            className={`w-full flex items-start gap-3 p-3 text-left hover:bg-white/5 transition-colors ${
              currentEpisodeId === ep.id ? "bg-red-600/20 border-l-2 border-red-600" : ""
            }`}
          >
            {ep.thumbnailUrl ? (
              <img
                src={ep.thumbnailUrl}
                alt={ep.title}
                className="w-20 aspect-video object-cover rounded flex-none"
              />
            ) : (
              <div className="w-20 aspect-video bg-white/10 rounded flex-none flex items-center justify-center">
                <PlayCircle className="w-6 h-6 text-gray-500" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{ep.title}</p>
              <p className="text-gray-500 text-xs mt-0.5">{ep.duration ? `${ep.duration}m` : ""}</p>
              {ep.description && (
                <p className="text-gray-500 text-xs mt-1 line-clamp-2">{ep.description}</p>
              )}
            </div>
            {currentEpisodeId === ep.id && (
              <div className="flex-none">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-1" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function VideoPlayerPage() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const contentId = parseInt(id || "0", 10);
  const { isAuthenticated } = useAuth();

  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [autoPlayNext, setAutoPlayNext] = useState(true);

  const { data: movie, isLoading: loadingMovie } = useGetMovie(contentId, {
    query: { enabled: !!contentId, retry: 1, queryKey: getGetMovieQueryKey(contentId) },
  });
  const { data: anime, isLoading: loadingAnime } = useGetAnimeById(contentId, {
    query: { enabled: !!contentId && !movie, retry: 1, queryKey: getGetAnimeByIdQueryKey(contentId) },
  });
  const { data: tvShow, isLoading: loadingTv } = useGetTvShow(contentId, {
    query: { enabled: !!contentId && !movie && !anime, retry: 1, queryKey: getGetTvShowQueryKey(contentId) },
  });

  const content = movie || anime || tvShow;
  const contentType = movie ? "movie" : anime ? "anime" : tvShow ? "tv" : null;
  const isSeries = contentType === "tv" || contentType === "anime";
  const isLoading = !content && (loadingMovie || loadingAnime || loadingTv);

  const { data: episodes } = useGetEpisodes(contentId, {
    query: { enabled: !!contentId && isSeries, queryKey: getGetEpisodesQueryKey(contentId) },
  });

  const { data: relatedMovies } = useGetRelatedMovies(contentId, {
    query: { enabled: contentType === "movie", queryKey: getGetRelatedMoviesQueryKey(contentId) },
  });
  const { data: relatedAnime } = useGetRelatedAnime(contentId, {
    query: { enabled: contentType === "anime", queryKey: getGetRelatedAnimeQueryKey(contentId) },
  });
  const { data: relatedTv } = useGetRelatedTv(contentId, {
    query: { enabled: contentType === "tv", queryKey: getGetRelatedTvQueryKey(contentId) },
  });
  const relatedContent = relatedMovies || relatedAnime || relatedTv || [];

  const { data: trendingMovies } = useGetTrendingMovies({ query: { queryKey: getGetTrendingMoviesQueryKey() } });
  const { data: trendingAnime } = useGetTrendingAnime({ query: { queryKey: getGetTrendingAnimeQueryKey() } });
  const { data: trendingTv } = useGetTrendingTv({ query: { queryKey: getGetTrendingTvQueryKey() } });
  const { data: latestMovies } = useGetLatestMovies({ query: { queryKey: getGetLatestMoviesQueryKey() } });
  const { data: continueWatching } = useGetContinueWatching({
    query: { enabled: isAuthenticated, queryKey: getGetContinueWatchingQueryKey() },
  });

  const trendingAll = [...(trendingMovies || []), ...(trendingAnime || []), ...(trendingTv || [])]
    .filter(c => c.id !== contentId)
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 20);

  const continueItems = (continueWatching || [])
    .map(cw => cw.content)
    .filter(Boolean)
    .filter(c => c!.id !== contentId) as Content[];

  const activeVideoUrl = selectedEpisode?.videoUrl || content?.videoUrl || "";
  const activeTitle = selectedEpisode
    ? `${content?.title} — ${selectedEpisode.title}`
    : content?.title || "";

  const handleEpisodeEnded = useCallback(() => {
    if (!autoPlayNext || !episodes || episodes.length === 0) return;
    const currentIdx = selectedEpisode
      ? episodes.findIndex(e => e.id === selectedEpisode.id)
      : -1;
    const nextEp = episodes[currentIdx + 1];
    if (nextEp) setSelectedEpisode(nextEp);
  }, [autoPlayNext, episodes, selectedEpisode]);

  const handlePrevEpisode = () => {
    if (!episodes) return;
    const currentIdx = selectedEpisode
      ? episodes.findIndex(e => e.id === selectedEpisode.id)
      : 0;
    if (currentIdx > 0) setSelectedEpisode(episodes[currentIdx - 1]);
  };

  const handleNextEpisode = () => {
    if (!episodes) return;
    const currentIdx = selectedEpisode
      ? episodes.findIndex(e => e.id === selectedEpisode.id)
      : -1;
    if (currentIdx < episodes.length - 1) setSelectedEpisode(episodes[currentIdx + 1]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
        <p className="text-xl">Content not found</p>
        <Link href="/" className="text-red-500 hover:text-red-400 underline">Go Home</Link>
      </div>
    );
  }

  const currentEpIdx = selectedEpisode && episodes
    ? episodes.findIndex(e => e.id === selectedEpisode.id)
    : -1;
  const hasPrev = currentEpIdx > 0;
  const hasNext = episodes ? currentEpIdx < episodes.length - 1 : false;

  return (
    <div className="min-h-screen bg-[#141414]">
      <div className="bg-black sticky top-0 z-40">
        <div className="flex items-center gap-4 px-4 py-3">
          <Link href={`/content/${content.id}`} className="text-white hover:text-gray-300 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <span className="text-white font-semibold truncate">{activeTitle}</span>
          {isSeries && episodes && episodes.length > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={handlePrevEpisode}
                disabled={!hasPrev}
                className="text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-gray-400 text-sm">
                {selectedEpisode ? `S${selectedEpisode.season}:E${selectedEpisode.episode}` : "Select Episode"}
              </span>
              <button
                onClick={handleNextEpisode}
                disabled={!hasNext}
                className="text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="w-full bg-black">
        {activeVideoUrl ? (
          <VideoPlayer
            videoUrl={activeVideoUrl}
            title={activeTitle}
            contentId={contentId}
            isAuthenticated={isAuthenticated}
            onEnded={handleEpisodeEnded}
          />
        ) : (
          <div className="w-full aspect-video bg-black flex flex-col items-center justify-center gap-4 text-gray-500">
            <Play className="w-16 h-16" />
            <p>No video available for this title</p>
          </div>
        )}
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <div className="flex gap-4">
              {content.posterUrl && (
                <img
                  src={content.posterUrl}
                  alt={content.title}
                  className="w-24 md:w-36 aspect-[2/3] object-cover rounded-lg flex-none shadow-2xl"
                />
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-white text-2xl md:text-3xl font-black leading-tight">{content.title}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-400">
                  {content.year && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {content.year}
                    </span>
                  )}
                  {content.duration && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDuration(content.duration)}
                    </span>
                  )}
                  <span className="px-2 py-0.5 bg-white/10 rounded text-xs font-medium uppercase tracking-wide">
                    {content.type}
                  </span>
                  {content.rating && (
                    <span className="text-green-500 font-semibold">
                      {(content.rating * 10).toFixed(0)}% Match
                    </span>
                  )}
                </div>
                {content.rating && (
                  <div className="mt-2">
                    <StarRating rating={content.rating} />
                  </div>
                )}
                {content.genres && content.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {content.genres.map(g => (
                      <span key={g} className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300 font-medium">
                        {g}
                      </span>
                    ))}
                  </div>
                )}
                {content.description && (
                  <p className="text-gray-300 mt-3 text-sm md:text-base leading-relaxed line-clamp-4">
                    {content.description}
                  </p>
                )}
              </div>
            </div>

            {isSeries && episodes && episodes.length > 0 && (
              <EpisodePanel
                episodes={episodes}
                currentEpisodeId={selectedEpisode?.id || null}
                onSelectEpisode={setSelectedEpisode}
                autoPlayNext={autoPlayNext}
                onToggleAutoPlay={() => setAutoPlayNext(p => !p)}
              />
            )}

            {relatedContent.length > 0 && (
              <div>
                <h2 className="text-white text-xl font-bold mb-4">More Like This</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {relatedContent.slice(0, 12).map(item => (
                    <ContentCard key={item.id} content={item} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="xl:col-span-1 space-y-8">
            {continueItems.length > 0 && (
              <div>
                <h2 className="text-white text-lg font-bold mb-3">Continue Watching</h2>
                <div className="space-y-2">
                  {continueItems.slice(0, 4).map(item => (
                    <Link key={item.id} href={`/watch/${item.id}`}>
                      <div className="flex items-center gap-3 p-2 rounded hover:bg-white/5 transition-colors cursor-pointer">
                        <img
                          src={item.posterUrl || ""}
                          alt={item.title}
                          className="w-14 aspect-video object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{item.title}</p>
                          <p className="text-gray-500 text-xs">{item.year}</p>
                        </div>
                        <Play className="w-4 h-4 text-gray-400 flex-none" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {relatedContent.length > 0 && (
              <div>
                <h2 className="text-white text-lg font-bold mb-3">Because You Watched This</h2>
                <div className="space-y-2">
                  {relatedContent.slice(0, 6).map(item => (
                    <Link key={item.id} href={`/watch/${item.id}`}>
                      <div className="flex items-center gap-3 p-2 rounded hover:bg-white/5 transition-colors cursor-pointer">
                        <img
                          src={item.posterUrl || ""}
                          alt={item.title}
                          className="w-14 aspect-video object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{item.title}</p>
                          <p className="text-gray-500 text-xs capitalize">{item.type} · {item.year}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {trendingAll.slice(0, 6).length > 0 && (
              <div>
                <h2 className="text-white text-lg font-bold mb-3">Trending Now</h2>
                <div className="space-y-2">
                  {trendingAll.slice(0, 6).map(item => (
                    <Link key={item.id} href={`/watch/${item.id}`}>
                      <div className="flex items-center gap-3 p-2 rounded hover:bg-white/5 transition-colors cursor-pointer">
                        <img
                          src={item.posterUrl || ""}
                          alt={item.title}
                          className="w-14 aspect-video object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{item.title}</p>
                          <p className="text-gray-500 text-xs capitalize">{item.type} · {item.viewCount?.toLocaleString()} views</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 space-y-2">
          {relatedContent.length > 0 && (
            <ContentRow title="You May Also Like" items={relatedContent} />
          )}
          {trendingAll.length > 0 && (
            <ContentRow title="Trending Now" items={trendingAll} />
          )}
          {latestMovies && latestMovies.length > 0 && (
            <ContentRow title="Recently Added" items={latestMovies.filter(m => m.id !== contentId)} />
          )}
          {trendingAnime && trendingAnime.length > 0 && contentType !== "anime" && (
            <ContentRow title="Popular Anime" items={trendingAnime} />
          )}
          {trendingTv && trendingTv.length > 0 && contentType !== "tv" && (
            <ContentRow title="Popular TV Shows" items={trendingTv} />
          )}
        </div>
      </div>
    </div>
  );
}
