import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { ContentGrid } from "@/components/ContentGrid";
import { NoApiKey } from "@/components/NoApiKey";
import { hasApiKey, getMovieGenres, getTVGenres, discoverByGenre } from "@/services/tmdb";

type GenreType = "movie" | "tv";

export default function Genres() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [type, setType] = useState<GenreType>((searchParams.get("type") as GenreType) ?? "movie");
  const selectedGenreId = searchParams.get("id") ? Number(searchParams.get("id")) : null;
  const [page, setPage] = useState(1);

  if (!hasApiKey()) return <NoApiKey />;

  const { data: movieGenres } = useQuery({ queryKey: ["genres", "movie"], queryFn: getMovieGenres });
  const { data: tvGenres } = useQuery({ queryKey: ["genres", "tv"], queryFn: getTVGenres });

  const genres = type === "movie" ? movieGenres?.genres ?? [] : tvGenres?.genres ?? [];

  const { data: content, isLoading } = useQuery({
    queryKey: ["genre-content", selectedGenreId, type, page],
    queryFn: () => discoverByGenre(selectedGenreId!, type, page),
    enabled: !!selectedGenreId,
  });

  const selectGenre = (id: number) => {
    setSearchParams({ id: String(id), type });
    setPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectedGenre = genres.find((g) => g.id === selectedGenreId);

  return (
    <Layout>
      <div className="pt-24 px-4 md:px-8 lg:px-12 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-white">
            {selectedGenre ? selectedGenre.name : "Genres"}
          </h1>
          <div className="flex gap-2">
            {(["movie", "tv"] as GenreType[]).map((t) => (
              <button
                key={t}
                onClick={() => { setType(t); setSearchParams(selectedGenreId ? { id: String(selectedGenreId), type: t } : { type: t }); setPage(1); }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  type === t ? "bg-netflix-red text-white" : "bg-netflix-dark text-gray-300 hover:bg-gray-700"
                }`}
              >
                {t === "movie" ? "Movies" : "TV Shows"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {genres.map((g) => (
            <button
              key={g.id}
              onClick={() => selectGenre(g.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                g.id === selectedGenreId
                  ? "bg-netflix-red text-white"
                  : "bg-netflix-dark text-gray-300 hover:bg-gray-700 border border-gray-700"
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {selectedGenreId ? (
          <ContentGrid
            items={(content?.results ?? []) as { id: number; title?: string; name?: string; poster_path: string | null; backdrop_path?: string | null; vote_average: number; overview: string; release_date?: string; first_air_date?: string; genre_ids?: number[] }[]}
            mediaType={type}
            isLoading={isLoading}
            page={page}
            totalPages={Math.min((content?.total_pages as number) ?? 1, 20)}
            onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4">🎭</div>
            <p className="text-gray-400 text-lg">Select a genre to explore content</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
