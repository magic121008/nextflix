import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-netflix-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="text-netflix-red font-black text-9xl mb-4 leading-none">404</div>
        <h1 className="text-3xl font-bold text-white mb-3">Lost Your Way?</h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Sorry, we can't find that page. You'll find lots to explore on the home page.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-white hover:bg-gray-200 text-black font-bold px-8 py-3 rounded-lg transition-colors"
        >
          <Home className="w-5 h-5" />
          NEXTFLIX Home
        </Link>
      </motion.div>
    </div>
  );
}
