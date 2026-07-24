"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Loader2 } from "lucide-react";
import { addUser, removeUser } from "@/utils/userSlice";
import { profileApi } from "@/lib/api";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  // If user is already in Redux, no need to show spinner or call API.
  const [isChecking, setIsChecking] = useState(!user);

  useEffect(() => {
    // ✅ User already in Redux store — zero API call, render immediately.
    if (user) {
      setIsChecking(false);
      return;
    }

    // 🔄 No user in Redux (hard refresh / direct URL) — try to restore
    // the session from the httpOnly cookie by calling the backend once.
    let cancelled = false;

    const restoreSession = async () => {
      try {
        const res = await profileApi.view();
        if (!cancelled) dispatch(addUser(res.data));
      } catch {
        // Cookie missing or expired → redirect to login
        if (!cancelled) {
          dispatch(removeUser());
          router.replace("/login");
        }
      } finally {
        if (!cancelled) setIsChecking(false);
      }
    };

    restoreSession();

    // Cleanup: if the component unmounts before the fetch completes,
    // discard the result to avoid setting state on an unmounted component.
    return () => {
      cancelled = true;
    };

  // ⚠️ Intentionally empty deps — we only want this to run ONCE per mount.
  // The `user` value is captured from the Redux store at mount time.
  // On client-side navigation the Redux store persists, so user will be
  // truthy and the early return above will fire — no API call.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show spinner only while verifying session (only on hard refresh / direct URL)
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  // Checking done but still no user → redirect in progress, render nothing
  if (!user) return null;

  return <>{children}</>;
}
