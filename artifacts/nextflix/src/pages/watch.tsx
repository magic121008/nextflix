import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "wouter";
import { useGetMovie, getGetMovieQueryKey, useGetAnimeById, getGetAnimeByIdQueryKey, useGetTvShow, getGetTvShowQueryKey, useUpdateWatchProgress } from "@workspace/api-client-react";
import { ArrowLeft, Loader2, Play, Pause, Maximize, Volume2, Settings } from "lucide-react";
import Hls from "hls.js";
import { useAuth } from "@/lib/auth";

export default function VideoPlayer() {
  const { id } = useParams();
  const contentId = parseInt(id || "0", 10);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isAuthenticated } = useAuth();
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const { data: movie, isLoading: loadingMovie } = useGetMovie(contentId, { query: { enabled: !!contentId, retry: 1, queryKey: getGetMovieQueryKey(contentId) } });
  const { data: anime, isLoading: loadingAnime } = useGetAnimeById(contentId, { query: { enabled: !!contentId && !movie, retry: 1, queryKey: getGetAnimeByIdQueryKey(contentId) } });
  const { data: tvShow, isLoading: loadingTv } = useGetTvShow(contentId, { query: { enabled: !!contentId && !movie && !anime, retry: 1, queryKey: getGetTvShowQueryKey(contentId) } });

  const content = movie || anime || tvShow;
  const isLoading = loadingMovie && loadingAnime && loadingTv;
  const updateProgress = useUpdateWatchProgress();

  useEffect(() => {
    if (!content?.videoUrl || !videoRef.current) return;
    
    const video = videoRef.current;
    const url = content.videoUrl;

    if (url.endsWith('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(e => console.log("Auto-play prevented", e));
        });
        return () => hls.destroy();
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(e => console.log("Auto-play prevented", e));
        });
      }
    } else {
      video.src = url;
      video.play().catch(e => console.log("Auto-play prevented", e));
    }
  }, [content?.videoUrl]);

  // Handle auto-save progress
  useEffect(() => {
    if (!isAuthenticated || !content) return;
    
    const interval = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused) {
        updateProgress.mutate({
          data: {
            contentId: content.id,
            progressSeconds: Math.floor(videoRef.current.currentTime),
            durationSeconds: Math.floor(videoRef.current.duration || 0)
          }
        });
      }
    }, 10000); // Save every 10 seconds
    
    return () => clearInterval(interval);
  }, [isAuthenticated, content, updateProgress]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="w-12 h-12 text-primary animate-spin" /></div>;
  }

  if (!content) {
    return <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
      <p>Content not found</p>
      <Link href="/" className="text-primary hover:underline">Go Home</Link>
    </div>;
  }

  // If videoUrl is an iframe embed (like youtube)
  if (content.videoUrl && content.videoUrl.includes('<iframe')) {
    return (
      <div className="w-full h-screen bg-black">
        <Link href={`/content/${content.id}`} className="absolute top-6 left-6 z-50 text-white opacity-70 hover:opacity-100 flex items-center gap-2">
          <ArrowLeft className="w-6 h-6" />
          <span>Back</span>
        </Link>
        <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: content.videoUrl }} />
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-screen bg-black overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <div className={`absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/60 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`} />
      
      <Link href={`/content/${content.id}`} className={`absolute top-8 left-8 z-50 text-white hover:text-gray-300 flex items-center gap-2 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <ArrowLeft className="w-8 h-8" />
        <span className="text-xl font-medium drop-shadow-md">Back to Details</span>
      </Link>
      
      <div className={`absolute bottom-0 left-0 right-0 p-8 pt-24 transition-transform duration-300 ${showControls ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="text-white text-2xl font-bold mb-4 drop-shadow-md">{content.title}</div>
        
        <div className="w-full h-1.5 bg-gray-600/50 rounded-full cursor-pointer mb-6 relative group" onClick={(e) => {
          if (videoRef.current) {
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            videoRef.current.currentTime = pos * duration;
          }
        }}>
          <div className="h-full bg-primary rounded-full relative" style={{ width: `${progress}%` }}>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow opacity-0 group-hover:opacity-100 transform translate-x-1/2" />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={togglePlay} className="text-white hover:text-gray-300">
              {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10" />}
            </button>
            <div className="flex items-center gap-3 group">
              <button className="text-white hover:text-gray-300">
                <Volume2 className="w-8 h-8" />
              </button>
            </div>
            <div className="text-white font-medium text-lg font-mono">
              {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-white hover:text-gray-300">
              <Settings className="w-8 h-8" />
            </button>
            <button onClick={toggleFullscreen} className="text-white hover:text-gray-300">
              <Maximize className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
