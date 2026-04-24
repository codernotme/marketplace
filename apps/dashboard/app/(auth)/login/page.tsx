import { Metadata } from "next"
import { LoginForm } from "@modules/auth/components/LoginForm"

export const metadata: Metadata = {
  title: "Login | The Mrktplace",
  description: "Login to your Mrktplace account.",
}

export default function LoginPage() {
  return (
    <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-background/50 mix-blend-multiply" />
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
        
        {/* Subtle background decoration */}
        <div className="absolute inset-0 z-10 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}></div>

        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-xl leading-tight tracking-tight text-white/90">
              "A truly refined commerce experience. The speed and precision of the POS have transformed our daily operations."
            </p>
            <footer className="text-sm font-sans text-white/60">Sofia Davis, Boutique Owner</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8 relative z-20 flex w-full h-full items-center justify-center bg-background">
        <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[380px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground font-sans">
              Enter your email and password to sign in
            </p>
          </div>
          <LoginForm />
          <p className="px-8 text-center text-sm text-muted-foreground font-sans">
            Don't have an account?{" "}
            <a
              href="/register"
              className="underline underline-offset-4 hover:text-primary transition-colors"
            >
              Request Access
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
