import { Geist_Mono, Figtree, Raleway } from "next/font/google";
import "@workspace/ui/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@workspace/ui/lib/utils";
import type { Metadata } from "next";
import { LandingHeader, MainFooter } from "@/components/layout-shell";

const ralewayHeading = Raleway({
  subsets: ["latin"],
  variable: "--font-heading",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    template: "%s | themrktplace",
    default: "themrktplace — The Modern Commerce Platform for India",
  },
  description: "Launch your marketplace, POS, and storefront in minutes. Multi-tenant, secure, and hyper-scalable.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        figtree.variable,
        ralewayHeading.variable,
        "font-sans"
      )}
    >
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap" />
      </head>
      <body className="min-h-screen bg-[#080808] text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <LandingHeader />
            <main className="flex-1 overflow-x-hidden">{children}</main>
            <MainFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

// Minimal Button component proxy if not imported correctly
function Button({ children, className, variant = "default", size = "default", ...props }: any) {
  const variants: any = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  };
  const sizes: any = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3",
    lg: "h-11 px-8",
  };
  return (
    <button 
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
