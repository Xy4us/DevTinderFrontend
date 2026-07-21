"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserCard } from "@/components/UserCard";
import { EmptyState } from "@/components/EmptyState";
import { userApi, requestApi } from "@/lib/api";
import { Loader2, Users } from "lucide-react";
import toast from "react-hot-toast";
import { AnimatePresence } from "framer-motion";

export default function FeedPage() {
  const [feedUsers, setFeedUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchFeed();
  }, [page]);

  const fetchFeed = async () => {
    setIsLoading(true);
    try {
      const res = await userApi.feed(page, 10);
      setFeedUsers(res.data.feed || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (status: 'interested' | 'ignored', userId: string) => {
    try {
      await requestApi.send(status, userId);
      // Remove user from feed
      setFeedUsers(prev => prev.filter(u => u._id !== userId));
      toast.success(status === 'interested' ? 'Liked!' : 'Passed!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
        <Navbar />
        
        <main className="flex-1 container mx-auto max-w-7xl px-4 py-8 flex flex-col items-center justify-center">
          {isLoading && feedUsers.length === 0 ? (
             <div className="flex flex-col items-center justify-center space-y-4">
               <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
               <p className="text-zinc-500 font-medium">Finding developers near you...</p>
             </div>
          ) : feedUsers.length > 0 ? (
            <div className="w-full relative h-[600px] flex items-center justify-center">
              <AnimatePresence mode="popLayout">
                {feedUsers.length > 0 && (
                  <div key={feedUsers[0]._id} className="absolute z-10 w-full flex justify-center">
                    <UserCard 
                      user={feedUsers[0]} 
                      showActions={true} 
                      onInterested={(id) => handleAction('interested', id)}
                      onIgnored={(id) => handleAction('ignored', id)}
                    />
                  </div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <EmptyState 
              icon={Users} 
              title="No more developers" 
              message="You've seen everyone for now! Check back later or adjust your filters."
            />
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
