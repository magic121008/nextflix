import { useGetAdminStats, getGetAdminStatsQueryKey, useGetAdminUsers, getGetAdminUsersQueryKey, useGetMovies, getGetMoviesQueryKey } from "@workspace/api-client-react";
import { Loader2, Users, Film, Tv, LayoutDashboard, PlaySquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const { data: stats, isLoading: loadingStats } = useGetAdminStats({ query: { queryKey: getGetAdminStatsQueryKey() }});
  
  if (loadingStats) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  return (
    <div className="pt-24 px-6 lg:px-12 pb-20 w-full min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white tracking-wide flex items-center gap-4">
          <LayoutDashboard className="w-8 h-8 text-primary" />
          Admin Dashboard
        </h1>
        <Button className="bg-primary text-white hover:bg-primary/90">Add Content</Button>
      </div>
      
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-medium text-lg">Total Users</h3>
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-4xl font-bold text-white">{stats.totalUsers}</p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-medium text-lg">Movies</h3>
              <Film className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-4xl font-bold text-white">{stats.totalMovies}</p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-medium text-lg">Anime</h3>
              <PlaySquare className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-4xl font-bold text-white">{stats.totalAnime}</p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-medium text-lg">TV Shows</h3>
              <Tv className="w-6 h-6 text-orange-400" />
            </div>
            <p className="text-4xl font-bold text-white">{stats.totalTvShows}</p>
          </div>
        </div>
      )}
      
      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Recent Content</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead className="bg-gray-800/50 text-gray-400 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Year</th>
                <th className="px-6 py-4 font-medium">Views</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {stats?.recentContent?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{item.title}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full border border-gray-700 bg-gray-800">
                      {item.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">{item.year || "-"}</td>
                  <td className="px-6 py-4">{item.viewCount || 0}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:text-white">Edit</Button>
                  </td>
                </tr>
              ))}
              {(!stats?.recentContent || stats.recentContent.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No content found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
