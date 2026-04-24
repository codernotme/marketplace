import { Metadata } from "next"
import { VerifyEmailComponent } from "@modules/auth/components/VerifyEmailComponent"

export const metadata: Metadata = {
  title: "Verify Email | The Mrktplace",
  description: "Verify your email address.",
}

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  const token = searchParams.token

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      
      {/* Left Pane (Image / Branding) */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-background/80 mix-blend-multiply" />
        
        {/* Subtle noise filter for luxury feel */}
        <div className="absolute inset-0 z-10 opacity-[0.15]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}></div>

        <div className="relative z-20 flex items-center text-2xl font-semibold tracking-tighter">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-8 w-8 text-primary"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          The Mrktplace
        </div>

        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-4">
            <h2 className="text-3xl font-semibold text-white">Almost there.</h2>
            <p className="text-lg font-sans text-white/80 max-w-lg">
              Security and exclusivity are at the heart of The Mrktplace. We require identity verification to ensure your data remains protected.
            </p>
          </blockquote>
        </div>
      </div>

      {/* Right Pane (Form) */}
      <div className="p-8 relative z-20 flex w-full h-full items-center justify-center bg-background">
        <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[450px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Verify your Email
            </h1>
            <p className="text-sm text-muted-foreground font-sans">
              We've sent a secure link to your business email.
            </p>
          </div>
          
          <VerifyEmailComponent token={token} />
          
        </div>
      </div>
    </div>
  )
}
