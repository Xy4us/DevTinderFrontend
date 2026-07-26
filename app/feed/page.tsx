"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserCard } from "@/components/UserCard";
import { EmptyState } from "@/components/EmptyState";
import { userApi, requestApi } from "@/lib/api";
import { Loader2, Users, AlertTriangle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeUserFromFeed } from "@/utils/feedSlice";
import { Button } from "@/components/ui/button";

export default function FeedPage() {
  const dispatch = useDispatch();
  const feed = useSelector((store: any) => store.feed);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchFeed = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await userApi.feed(page, 10);
      const feedData = res?.data?.feed || [];
      dispatch(addFeed(feedData));
    } catch (err: any) {
      console.error("Error fetching feed:", err);
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch feed. Please ensure the backend server is running.";
      setError(errMsg);
      toast.error("Failed to load feed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!feed || feed.length === 0) {
      fetchFeed();
    } else {
      setIsLoading(false);
    }
  }, [page]);

  const handleAction = async (
    status: "interested" | "ignored",
    userId: string
  ) => {
    const targetUser = feed?.find((u: any) => u._id === userId);
    const userName = targetUser ? targetUser.firstName : "Developer";

    // Optimistically remove user card from UI feed
    dispatch(removeUserFromFeed(userId));

    try {
      await requestApi.send(status, userId);
      toast.success(
        status === "interested"
          ? `Connected with ${userName}!`
          : `Passed on ${userName}`
      );
    } catch (err: any) {
      console.error("Action error:", err);
      const errMsg =
        err?.response?.data?.message || "Failed to send connection request";
      toast.error(errMsg);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
        <Navbar />

        <main className="flex-1 container mx-auto max-w-7xl px-4 py-8 flex flex-col items-center justify-center">
          {isLoading && (!feed || feed.length === 0) ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-16">
              <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
              <p className="text-zinc-600 dark:text-zinc-400 font-medium text-lg">
                Finding developers near you...
              </p>
            </div>
          ) : error ? (
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/50 rounded-3xl p-8 shadow-xl text-center flex flex-col items-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-500">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Something went wrong!
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {error}
              </p>
              <Button
                onClick={() => fetchFeed()}
                className="mt-4 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          ) : feed && feed.length > 0 ? (
            <div className="w-full max-w-sm relative h-[650px] flex items-center justify-center">
              {/* Stack background card preview */}
              {feed.length > 1 && (
                <div className="absolute top-4 w-full scale-95 opacity-60 pointer-events-none transform translate-y-3">
                  <UserCard user={feed[1]} showActions={false} />
                </div>
              )}

              {/* Active top card */}
              <AnimatePresence mode="popLayout">
                <div key={feed[0]._id} className="absolute z-10 w-full">
                  <UserCard
                    user={feed[0]}
                    showActions={true}
                    isSwipeable={true}
                    onInterested={(id) => handleAction("interested", id)}
                    onIgnored={(id) => handleAction("ignored", id)}
                  />
                </div>
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <EmptyState
                icon={Users}
                title="No more developers"
                message="You've seen everyone for now! Check back later or refresh your feed."
              />
              <Button
                onClick={() => fetchFeed()}
                variant="outline"
                className="gap-2 rounded-xl border-zinc-300 dark:border-zinc-700"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Feed
              </Button>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
