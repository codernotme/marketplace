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
    template: "%s | themrktplace Store",
    default: "themrktplace Store",
  },
  description: "A premium shopping experience powered by themrktplace.",
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
            {/* Storefront Navbar Placeholder */}
            <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-8">
                <div className="flex items-center gap-6">
                  <a href="/" className="flex items-center space-x-2">
                    <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">m</div>
                    <span className="font-heading font-bold text-xl tracking-tight hidden sm:inline-block">themrktplace</span>
                  </a>
                  <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <a href="/products" className="transition-colors hover:text-primary">Shop All</a>
                    <a href="/categories/new-arrivals" className="transition-colors hover:text-primary">New Arrivals</a>
                    <a href="/categories/featured" className="transition-colors hover:text-primary">Featured</a>
                  </nav>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden lg:flex relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </div>
                    <input className="flex h-9 w-64 rounded-full border border-input bg-muted/50 px-10 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background" placeholder="Search products..." />
                  </div>
                  <a href="/account" className="p-2 hover:bg-muted rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </a>
                  <a href="/cart" className="p-2 hover:bg-muted rounded-full transition-colors relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    <span className="absolute top-1 right-1 size-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">0</span>
                  </a>
                </div>
              </div>
            </header>
            
            <main className="flex-1">{children}</main>
            
            {/* Storefront Footer Placeholder */}
            <footer className="border-t border-border bg-muted/30">
              <div className="container mx-auto px-4 py-12 md:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                  <div className="col-span-2 lg:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="size-6 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">m</div>
                      <span className="font-heading font-bold text-lg tracking-tight">themrktplace</span>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-xs mb-6">
                      Discover curated products from independent merchants around the world.
                    </p>
                    <div className="flex gap-4">
                      {/* Social icons */}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-4">Shop</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li><a href="/products" className="hover:text-primary">All Products</a></li>
                      <li><a href="/categories/new" className="hover:text-primary">New Arrivals</a></li>
                      <li><a href="/categories/sale" className="hover:text-primary">Sale</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-4">Account</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li><a href="/account" className="hover:text-primary">Profile</a></li>
                      <li><a href="/account/orders" className="hover:text-primary">Orders</a></li>
                      <li><a href="/account/wishlist" className="hover:text-primary">Wishlist</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-4">Support</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li><a href="/faq" className="hover:text-primary">FAQ</a></li>
                      <li><a href="/shipping" className="hover:text-primary">Shipping</a></li>
                      <li><a href="/returns" className="hover:text-primary">Returns</a></li>
                      <li><a href="/contact" className="hover:text-primary">Contact</a></li>
                    </ul>
                  </div>
                </div>
                <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                  <p>© 2026 themrktplace. All rights reserved.</p>
                  <div className="flex gap-6">
                    <a href="/privacy" className="hover:text-primary">Privacy Policy</a>
                    <a href="/terms" className="hover:text-primary">Terms of Service</a>
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
