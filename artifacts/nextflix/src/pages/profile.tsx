import { useGetMe, getGetMeQueryKey, useUpdateUser } from "@workspace/api-client-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function Profile() {
  const { data: user, isLoading } = useGetMe({ query: { queryKey: getGetMeQueryKey() }});
  const updateUser = useUpdateUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [name, setName] = useState("");
  
  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    updateUser.mutate(
      { id: user.id, data: { name } },
      {
        onSuccess: () => {
          toast({ title: "Profile updated successfully" });
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        },
        onError: () => {
          toast({ title: "Failed to update profile", variant: "destructive" });
        }
      }
    );
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  if (!user) return null;

  return (
    <div className="pt-24 px-6 lg:px-12 pb-20 w-full min-h-screen max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-white tracking-wide mb-12">Edit Profile</h1>
      
      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="w-40 h-40 bg-gray-800 rounded flex items-center justify-center shrink-0 border-2 border-transparent hover:border-white transition-colors cursor-pointer">
          <img 
            src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} 
            alt={user.name} 
            className="w-full h-full object-cover rounded"
          />
        </div>
        
        <div className="flex-1 w-full space-y-8">
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div>
              <label className="block text-gray-400 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-800 border-none text-white rounded px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full bg-gray-900 border-none text-gray-500 rounded px-4 py-3 cursor-not-allowed"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 mb-2">Account Type</label>
              <div className="text-white font-medium px-4 py-3 bg-gray-900 rounded inline-block">
                {user.role.toUpperCase()}
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-800 flex gap-4">
              <Button type="submit" className="bg-white text-black hover:bg-gray-200 font-bold px-8">
                {updateUser.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
