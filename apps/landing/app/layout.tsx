import { Geist, Geist_Mono, Figtree, Raleway } from "next/font/google";
import "@workspace/ui/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@workspace/ui/lib/utils";
import type { Metadata } from "next";

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
      <body className="min-h-screen bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            {/* Landing Header */}
            <header className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/40">
              <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-8">
                <a href="/" className="flex items-center space-x-2">
                  <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">m</div>
                  <span className="font-heading font-bold text-xl tracking-tight">themrktplace</span>
                </a>
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                  <a href="#features" className="transition-colors hover:text-foreground">Features</a>
                  <a href="#solutions" className="transition-colors hover:text-foreground">Solutions</a>
                  <a href="#pricing" className="transition-colors hover:text-foreground">Pricing</a>
                  <a href="/docs" className="transition-colors hover:text-foreground">Docs</a>
                </nav>
                <div className="flex items-center gap-4">
                  <a href="https://app.themrktplace.io/login" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">Log in</a>
                  <Button size="sm" className="rounded-full px-5 h-9 font-semibold shadow-lg shadow-primary/20">
                    Get Started
                  </Button>
                </div>
              </div>
            </header>
            
            <main className="flex-1 pt-16">{children}</main>
            
            {/* Landing Footer */}
            <footer className="border-t border-border/50 bg-muted/20">
              <div className="container mx-auto px-4 py-16 md:px-8">
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
                    <div className="col-span-2">
                       <div className="flex items-center gap-2 mb-6">
                         <div className="size-6 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">m</div>
                         <span className="font-heading font-bold text-lg tracking-tight">themrktplace</span>
                       </div>
                       <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                         The infrastructure layer for modern commerce in India. Powering businesses from local kiosks to enterprise marketplaces.
                       </p>
                    </div>
                    <div>
                       <h4 className="font-bold text-sm mb-4">Platform</h4>
                       <ul className="space-y-3 text-sm text-muted-foreground">
                          <li><a href="#" className="hover:text-primary">Multi-tenant Admin</a></li>
                          <li><a href="#" className="hover:text-primary">Omnichannel POS</a></li>
                          <li><a href="#" className="hover:text-primary">Custom Storefronts</a></li>
                          <li><a href="#" className="hover:text-primary">Marketplace Engine</a></li>
                       </ul>
                    </div>
                    <div>
                       <h4 className="font-bold text-sm mb-4">Solutions</h4>
                       <ul className="space-y-3 text-sm text-muted-foreground">
                          <li><a href="#" className="hover:text-primary">B2B Trade</a></li>
                          <li><a href="#" className="hover:text-primary">D2C Brands</a></li>
                          <li><a href="#" className="hover:text-primary">Hyperlocal</a></li>
                          <li><a href="#" className="hover:text-primary">SaaS White-label</a></li>
                       </ul>
                    </div>
                    <div>
                       <h4 className="font-bold text-sm mb-4">Developers</h4>
                       <ul className="space-y-3 text-sm text-muted-foreground">
                          <li><a href="#" className="hover:text-primary">API Reference</a></li>
                          <li><a href="#" className="hover:text-primary">SDKs</a></li>
                          <li><a href="#" className="hover:text-primary">Integrations</a></li>
                          <li><a href="#" className="hover:text-primary">Open Source</a></li>
                       </ul>
                    </div>
                    <div>
                       <h4 className="font-bold text-sm mb-4">Company</h4>
                       <ul className="space-y-3 text-sm text-muted-foreground">
                          <li><a href="#" className="hover:text-primary">About Us</a></li>
                          <li><a href="#" className="hover:text-primary">Blog</a></li>
                          <li><a href="#" className="hover:text-primary">Careers</a></li>
                          <li><a href="#" className="hover:text-primary">Contact</a></li>
                       </ul>
                    </div>
                 </div>
                 <Separator className="bg-border/50" />
                 <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <p>© 2026 themrktplace Inc. Made with ❤️ in Bengaluru.</p>
                    <div className="flex gap-8">
                       <a href="/privacy" className="hover:text-primary">Privacy</a>
                       <a href="/terms" className="hover:text-primary">Terms</a>
                       <a href="/security" className="hover:text-primary">Security</a>
                    </div>
                 </div>
              </div>
            </footer>
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
