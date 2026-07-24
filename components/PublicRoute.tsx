"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

/**
 * PublicRoute — wraps pages that should NOT be accessible when logged in.
 * (e.g. /login, /signup)
 *
 * Logic — ONLY checks Redux, never calls the backend:
 *  • User in Redux (active session) → redirect to /feed immediately.
 *  • User not in Redux              → show the page (login / signup form).
 *
 * Why no API call here?
 *  Session restoration from cookie is handled by ProtectedRoute.
 *  Calling profileApi.view() here caused a bug: after logout the cookie
 *  was momentarily still valid, so PublicRoute would immediately redirect
 *  back to /feed instead of showing the login form.
 */
export function PublicRoute({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: any) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/feed");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // While redirect is in progress, render nothing to avoid a flash of login UI
  if (user) return null;

  return <>{children}</>;
}
