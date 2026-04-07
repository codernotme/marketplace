import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <body className="bg-background text-foreground font-inter">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

