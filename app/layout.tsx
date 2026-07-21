import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ReduxProvider } from "@/components/ReduxProvider";

export const metadata: Metadata = {
  title: "DevTinder",
  description: "Connect with other developers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className="bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 min-h-screen"
      >
        <SmoothScroll>
          <ReduxProvider>
            {children}
            <Toaster position="bottom-right" />
          </ReduxProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
