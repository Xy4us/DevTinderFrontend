"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RequestCard } from "@/components/RequestCard";
import { EmptyState } from "@/components/EmptyState";
import { userApi, requestApi } from "@/lib/api";
import { Loader2, Bell } from "lucide-react";
import toast from "react-hot-toast";

export default function RequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const res = await userApi.requestsReceived();
      setRequests(res.data.connectioRequests || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = async (status: 'accepted' | 'rejected', requestId: string) => {
    try {
      await requestApi.review(status, requestId);
      setRequests(prev => prev.filter(r => r._id !== requestId));
      toast.success(status === 'accepted' ? 'Request accepted!' : 'Request rejected');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
        <Navbar />
        
        <main className="flex-1 container mx-auto max-w-4xl px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 tracking-tight">Connection Requests</h1>
          
          {isLoading ? (
             <div className="flex justify-center p-12">
               <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
             </div>
          ) : requests.length > 0 ? (
            <div className="space-y-6">
              {requests.map(request => (
                <RequestCard 
                  key={request._id} 
                  request={request}
                  onAccept={(id) => handleReview('accepted', id)}
                  onReject={(id) => handleReview('rejected', id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState 
              icon={Bell} 
              title="No pending requests" 
              message="When other developers want to connect with you, their requests will appear here."
            />
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
