"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

export default function RootPage() {
  const user = useSelector((state: any) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/feed");
    } else {
      router.replace("/login");
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
    </div>
  );
}
