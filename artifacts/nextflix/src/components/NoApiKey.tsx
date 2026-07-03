import { AlertTriangle, ExternalLink } from "lucide-react";

export function NoApiKey() {
  return (
    <div className="min-h-screen bg-netflix-black flex items-center justify-center p-4">
      <div className="bg-netflix-dark border border-yellow-600/40 rounded-xl p-8 max-w-lg w-full text-center">
        <AlertTriangle className="w-14 h-14 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-3">TMDB API Key Required</h2>
        <p className="text-gray-400 mb-6 leading-relaxed">
          NEXTFLIX uses The Movie Database (TMDB) API to fetch movies, shows, and anime. You need a free API key to use the app.
        </p>
        <div className="bg-black/50 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-gray-300 font-medium mb-2">Setup:</p>
          <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside">
            <li>
              Visit{" "}
              <a
                href="https://www.themoviedb.org/settings/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-netflix-red hover:underline inline-flex items-center gap-1"
              >
                themoviedb.org/settings/api
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>Create a free account and request an API key</li>
            <li>
              Add{" "}
              <code className="bg-gray-800 px-1 py-0.5 rounded text-yellow-400 text-xs">VITE_TMDB_API_KEY=your_key</code>{" "}
              to your environment variables
            </li>
            <li>Restart the development server</li>
          </ol>
        </div>
        <a
          href="https://www.themoviedb.org/signup"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-netflix-red hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Get Free API Key
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
