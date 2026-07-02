import { useState } from "react";
import { useRegister } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const registerMutation = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(
      { data: { name, email, password } },
      {
        onSuccess: (data) => {
          login(data.token, data.user);
          toast({ title: "Welcome!", description: "Your account has been created." });
          setLocation("/");
        },
        onError: () => {
          toast({ title: "Registration failed", description: "Please check your inputs.", variant: "destructive" });
        }
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/90 relative">
      <div className="absolute inset-0 z-0">
        <img src="/images/banner-action.png" alt="Background" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      
      <div className="z-10 w-full max-w-md bg-black/80 p-12 rounded-lg backdrop-blur-sm border border-gray-800">
        <h1 className="text-4xl font-bold text-white mb-8 tracking-wide">Sign Up</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded px-4 py-4 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded px-4 py-4 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded px-4 py-4 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={registerMutation.isPending}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 text-lg rounded"
          >
            {registerMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Sign Up"}
          </Button>
        </form>
        
        <div className="mt-8 text-gray-400">
          <span className="mr-2">Already have an account?</span>
          <Link href="/login" className="text-white hover:underline font-medium">
            Sign in.
          </Link>
        </div>
      </div>
    </div>
  );
}
