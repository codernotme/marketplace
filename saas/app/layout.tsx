import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "theMrktPlace | SaaS Admin",
  description: "Platform management dashboard for theMrktPlace marketplace",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-950 text-slate-50">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
