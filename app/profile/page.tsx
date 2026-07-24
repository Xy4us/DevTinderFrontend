"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserCard } from "@/components/UserCard";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Edit, KeyRound } from "lucide-react";

export default function ProfilePage() {
  const user = useSelector((state: any) => state.user);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
        <Navbar />

        <main className="flex-1 container mx-auto max-w-4xl px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Link href="/profile/password" className="flex-1 md:flex-none">
                <Button variant="outline" className="w-full">
                  <KeyRound className="h-4 w-4 mr-2" />
                  Password
                </Button>
              </Link>
              <Link href="/profile/edit" className="flex-1 md:flex-none">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex justify-center">
            <UserCard user={user} showActions={false} />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
