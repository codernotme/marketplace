import { Geist_Mono, Figtree } from "next/font/google"
import "@workspace/ui/globals.css"
import { Providers } from "@/components/providers"
import { Header } from "@/components/storefront/Header"
import { Footer } from "@/components/storefront/Footer"
import { Toaster } from "sonner"
import { cn } from "@workspace/ui/lib/utils"

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" })
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata = {
  title: "themrktplace | Contemporary Apparel & Tailored Essentials",
  description: "Direct-to-consumer online store and omnichannel physical boutique.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", figtree.variable)}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  )
}
