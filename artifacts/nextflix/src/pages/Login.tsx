import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  if (isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    const result = await login(email.trim(), password);
    setLoading(false);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error ?? "Login failed.");
    }
  };

  const fillDemo = (role: "admin" | "user") => {
    setEmail(role === "admin" ? "admin@nextflix.com" : "user@nextflix.com");
    setPassword("admin123");
    setError("");
  };

  return (
    <div
      className="min-h-screen bg-netflix-black flex items-center justify-center p-4"
      style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(https://image.tmdb.org/t/p/original/mDfJG3LC3Dqb67AZ52x3Z0jU0uB.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/80 backdrop-blur-sm rounded-xl p-8 w-full max-w-md"
      >
        <Link to="/" className="block text-netflix-red font-black text-3xl text-center mb-8">NEXTFLIX</Link>

        <h1 className="text-2xl font-bold text-white mb-6">Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-gray-800 border border-gray-700 focus:border-netflix-red rounded-lg px-4 py-3 text-white outline-none transition-colors text-sm"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-gray-800 border border-gray-700 focus:border-netflix-red rounded-lg px-4 py-3 pr-10 text-white outline-none transition-colors text-sm"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-900/30 border border-red-700/50 rounded-lg px-3 py-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-netflix-red hover:bg-red-700 disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-800">
          <p className="text-gray-500 text-xs text-center mb-3">Demo Accounts</p>
          <div className="flex gap-2">
            <button
              onClick={() => fillDemo("user")}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs py-2 rounded transition-colors"
            >
              Demo User
            </button>
            <button
              onClick={() => fillDemo("admin")}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-netflix-red text-xs py-2 rounded transition-colors"
            >
              Admin
            </button>
          </div>
        </div>

        <p className="text-gray-500 text-sm text-center mt-6">
          New to NEXTFLIX?{" "}
          <Link to="/register" className="text-white hover:underline font-medium">Sign up now</Link>
        </p>
      </motion.div>
    </div>
  );
}
