import { ReactNode } from "react";
import { useLocation } from "wouter";
import { Navbar } from "./Navbar";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const isWatchPage = location.startsWith("/watch/");

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-white font-sans antialiased overflow-x-hidden">
      {!isWatchPage && <Navbar />}
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}
