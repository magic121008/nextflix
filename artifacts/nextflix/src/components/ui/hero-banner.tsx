import { Link } from "wouter";
import { Play, Info } from "lucide-react";
import type { Content } from "@workspace/api-client-react";
import { Button } from "./button";

interface HeroBannerProps {
  content: Content;
}

export function HeroBanner({ content }: HeroBannerProps) {
  return (
    <div className="relative w-full h-[85vh] flex items-center">
      <div className="absolute inset-0 z-0">
        <img
          src={content.bannerUrl || content.posterUrl || "/images/banner-action.png"}
          alt={content.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      </div>

      <div className="relative z-10 px-6 lg:px-12 w-full max-w-3xl space-y-6">
        <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight drop-shadow-2xl">
          {content.title}
        </h1>
        
        <div className="flex items-center gap-4 text-sm font-medium text-gray-300">
          <span className="text-green-500 font-bold">{content.rating ? `${(content.rating * 10).toFixed(0)}% Match` : "New"}</span>
          <span>{content.year}</span>
          <span className="px-2 py-0.5 border border-gray-600 rounded text-xs">
            {content.type.toUpperCase()}
          </span>
          {content.duration && <span>{Math.floor(content.duration / 60)}h {content.duration % 60}m</span>}
        </div>

        <p className="text-lg text-gray-300 line-clamp-3 max-w-2xl drop-shadow-md">
          {content.description}
        </p>

        <div className="flex items-center gap-4 pt-4">
          <Link href={`/watch/${content.id}`}>
            <Button size="lg" className="bg-white text-black hover:bg-white/90 text-lg px-8 py-6 rounded font-bold transition-all hover:scale-105">
              <Play className="w-6 h-6 mr-2 fill-black" />
              Play
            </Button>
          </Link>
          <Link href={`/content/${content.id}`}>
            <Button size="lg" variant="outline" className="bg-gray-500/40 text-white border-transparent hover:bg-gray-500/60 text-lg px-8 py-6 rounded font-bold backdrop-blur-sm transition-all hover:scale-105">
              <Info className="w-6 h-6 mr-2" />
              More Info
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
