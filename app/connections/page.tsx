"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserCard } from "@/components/UserCard";
import { EmptyState } from "@/components/EmptyState";
import { userApi } from "@/lib/api";
import { Loader2, Users } from "lucide-react";

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    setIsLoading(true);
    try {
      const res = await userApi.connections();
      setConnections(res.data.connections || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
        <Navbar />
        
        <main className="flex-1 container mx-auto max-w-7xl px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 tracking-tight">Your Connections</h1>
          
          {isLoading ? (
             <div className="flex justify-center p-12">
               <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
             </div>
          ) : connections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {connections.map(user => (
                <UserCard 
                  key={user._id} 
                  user={user}
                  showActions={false}
                />
              ))}
            </div>
          ) : (
            <EmptyState 
              icon={Users} 
              title="No connections yet" 
              message="Start swiping on the feed to find other developers to connect with."
            />
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
