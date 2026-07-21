import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h2 className="text-4xl font-bold mb-4 tracking-tight">404</h2>
      <h3 className="text-xl font-semibold mb-2">Page Not Found</h3>
      <p className="text-zinc-500 max-w-sm mb-6">The page you are looking for doesn't exist or has been moved.</p>
      <Link href="/feed">
        <Button>Return to Feed</Button>
      </Link>
    </div>
  );
}
