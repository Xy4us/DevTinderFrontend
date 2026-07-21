"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Code, Users, Bell } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "@/utils/userSlice";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import Image from "next/image";

export function Navbar() {
  const user = useSelector((store: any) => store.user);
  console.log(user);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      dispatch(removeUser());
      toast.success("Logout successful!");
      router.push("/login");
    } catch (err) {
      toast.error("Logout failed.");
    }
  };

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="container mx-auto max-w-7xl px-4 flex h-16 items-center justify-between">
        <Link
          href="/feed"
          className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary"
        >
          <Code className="h-6 w-6 text-indigo-500" />
          DevTinder
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/feed"
            className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors hidden md:block"
          >
            Feed
          </Link>
          <Link
            href="/connections"
            className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-1"
          >
            <Users className="h-4 w-4" />
            <span className="hidden md:inline">Connections</span>
          </Link>
          <Link
            href="/requests"
            className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-1"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">Requests</span>
          </Link>
          <Link href="/profile" className="flex items-center gap-2">
            <Image
              src={
                user.photoUrl ||
                "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png"
              }
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover border"
              height={32}
              width={32}
            />
            <span className="text-sm font-medium hidden sm:inline">
              {user.firstName}
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
