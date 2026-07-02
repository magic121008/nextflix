import React from "react";
import { Link } from "wouter";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-6 px-4">
          <div className="text-red-500 text-6xl font-black">!</div>
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-gray-400 text-center max-w-md">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <Link href="/">
            <button
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded font-semibold transition-colors"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Go Home
            </button>
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}
