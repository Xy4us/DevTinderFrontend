"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RequestCard } from "@/components/RequestCard";
import { EmptyState } from "@/components/EmptyState";
import { userApi, requestApi } from "@/lib/api";
import { Loader2, Bell, AlertTriangle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "@/utils/requestSlice";
import { Button } from "@/components/ui/button";

export default function RequestsPage() {
  const dispatch = useDispatch();
  const requests = useSelector((store: any) => store.requests);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await userApi.requestsReceived();
      // Backend has a typo: "connectioRequests" (not "connectionRequests")
      const data = res.data.connectioRequests || [];
      dispatch(addRequests(data));
    } catch (err: any) {
      console.error("Error fetching requests:", err);
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch requests. Make sure the backend is running.";
      setError(errMsg);
      toast.error("Failed to load requests");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if not already in Redux
    if (requests === null) {
      fetchRequests();
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleReview = async (
    status: "accepted" | "rejected",
    requestId: string
  ) => {
    // Optimistically remove from UI
    dispatch(removeRequest(requestId));
    try {
      await requestApi.review(status, requestId);
      toast.success(status === "accepted" ? "Request accepted! 🎉" : "Request rejected");
    } catch (err: any) {
      console.error("Review error:", err);
      toast.error(err?.response?.data?.message || "Action failed");
      // Refetch to restore accurate state since optimistic update may be wrong
      fetchRequests();
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
        <Navbar />

        <main className="flex-1 container mx-auto max-w-4xl px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Connection Requests
              {Array.isArray(requests) && requests.length > 0 && (
                <span className="ml-3 inline-flex items-center justify-center h-7 w-7 rounded-full bg-indigo-600 text-white text-sm font-semibold">
                  {requests.length}
                </span>
              )}
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRequests}
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

          {isLoading && requests === null ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
          ) : error ? (
            <div className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/50 rounded-3xl p-8 shadow-xl text-center flex flex-col items-center space-y-4">
              <div className="h-14 w-14 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-500">
                <AlertTriangle className="h-7 w-7" />
              </div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Something went wrong!
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {error}
              </p>
              <Button
                onClick={fetchRequests}
                className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          ) : Array.isArray(requests) && requests.length > 0 ? (
            <div className="space-y-4">
              {requests.map((request) => (
                <RequestCard
                  key={request._id}
                  request={request}
                  onAccept={(id) => handleReview("accepted", id)}
                  onReject={(id) => handleReview("rejected", id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Bell}
              title="No pending requests"
              message="When other developers send you a connection request, they will appear here."
            />
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
