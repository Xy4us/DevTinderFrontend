"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserCard } from "@/components/UserCard";
import { EmptyState } from "@/components/EmptyState";
import { userApi } from "@/lib/api";
import { Loader2, Users, RefreshCw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "@/utils/connectionSlice";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function ConnectionsPage() {
  const dispatch = useDispatch();
  // Render from Redux — always up to date after every fetch
  const connections = useSelector((store: any) => store.connections);

  const [isLoading, setIsLoading] = useState(true);

  const fetchConnections = async () => {
    setIsLoading(true);
    try {
      const res = await userApi.connections();
      // Store fresh data in Redux for this account
      dispatch(addConnections(res.data.connections || []));
    } catch (error: any) {
      console.error("Error fetching connections:", error);
      toast.error(error?.response?.data?.message || "Failed to load connections");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Always re-fetch on mount — connections change when other users
    // accept requests. Skipping the fetch risks showing stale data.
    fetchConnections();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
        <Navbar />

        <main className="flex-1 container mx-auto max-w-7xl px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Your Connections
              {Array.isArray(connections) && connections.length > 0 && (
                <span className="ml-3 inline-flex items-center justify-center h-7 w-7 rounded-full bg-indigo-600 text-white text-sm font-semibold">
                  {connections.length}
                </span>
              )}
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchConnections}
              className="gap-2 rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>

          {/* Show spinner only on first load (null means never fetched yet) */}
          {isLoading && connections === null ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
          ) : Array.isArray(connections) && connections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {connections.map((user) => (
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
