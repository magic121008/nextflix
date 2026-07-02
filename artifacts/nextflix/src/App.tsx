import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import { Layout } from "@/components/layout/Layout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import Movies from "@/pages/movies";
import Anime from "@/pages/anime";
import TvShows from "@/pages/tv";
import Search from "@/pages/search";
import Trending from "@/pages/trending";
import Latest from "@/pages/latest";
import Categories from "@/pages/categories";
import ContentDetail from "@/pages/content-detail";
import VideoPlayer from "@/pages/watch";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Watchlist from "@/pages/watchlist";
import Profile from "@/pages/profile";
import AdminDashboard from "@/pages/admin";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component, adminOnly = false }: { component: any, adminOnly?: boolean }) {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) return <Redirect to="/login" />;
  if (adminOnly && !isAdmin) return <Redirect to="/" />;
  
  return <Component />;
}

function AppContent() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/movies" component={Movies} />
        <Route path="/anime" component={Anime} />
        <Route path="/tv" component={TvShows} />
        <Route path="/search" component={Search} />
        
        <Route path="/trending" component={Trending} />
        <Route path="/latest" component={Latest} />
        <Route path="/categories" component={Categories} />
        <Route path="/content/:id" component={ContentDetail} />
        <Route path="/watch/:id" component={VideoPlayer} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        
        <Route path="/watchlist">
          <ProtectedRoute component={Watchlist} />
        </Route>
        <Route path="/profile">
          <ProtectedRoute component={Profile} />
        </Route>
        <Route path="/admin">
          <ProtectedRoute component={AdminDashboard} adminOnly={true} />
        </Route>
        
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <ErrorBoundary>
                <AppContent />
              </ErrorBoundary>
            </WouterRouter>
            <Toaster />
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
