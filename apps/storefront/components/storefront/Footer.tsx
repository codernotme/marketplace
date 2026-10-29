import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/20 text-muted-foreground">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-primary font-bold text-primary-foreground text-sm">
                M
              </div>
              <span className="text-lg font-bold text-foreground tracking-tight">
                themrktplace
              </span>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Modern apparel and tailored garments crafted from premium natural textiles. Direct-to-consumer online and in retail stores.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Collections
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li><Link href="/" className="hover:text-foreground">Tops & Shirts</Link></li>
              <li><Link href="/" className="hover:text-foreground">Trousers & Chinos</Link></li>
              <li><Link href="/" className="hover:text-foreground">Tailored Blazers</Link></li>
              <li><Link href="/" className="hover:text-foreground">Accessories & Silk Ties</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Flagship Stores
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li className="text-foreground font-medium">Indiranagar Flagship Store</li>
              <li>100ft Road, HAL 2nd Stage, Bengaluru</li>
              <li>Open Daily: 10:00 AM - 9:30 PM</li>
              <li className="pt-2 text-foreground font-medium">BOPIS Counter Active</li>
              <li>Order online, pick up in-store in 2 hours</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Customer Support
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li>Email: care@themrktplace.com</li>
              <li>Phone: +91 98765 43210</li>
              <li>GSTIN: 29ABCDE1234F1Z5</li>
              <li className="pt-2"><Link href="/login" className="text-primary hover:underline font-semibold">Customer Sign In</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border/40 pt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} themrktplace. All rights reserved. Single-Brand Standalone Omnichannel Retail Suite.
        </div>
      </div>
    </footer>
  )
}

