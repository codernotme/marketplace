"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button, Input, Checkbox, Label, Spinner } from "@heroui/react";
import { Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/dashboard"
      });
      
      if (error) {
        setError(error.message || "Failed to sign in. Check your credentials.");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col space-y-6"
    >
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h2>
        <p className="text-sm text-muted">
          Enter your credentials to access the admin panel.
        </p>
      </div>

      {error && (
        <div className="p-3 text-sm text-danger-foreground bg-danger/10 border border-danger/20 flex items-center gap-2 rounded-xl">
          <AlertCircle className="w-4 h-4 text-danger" />
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label>Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <Input
              required
              placeholder="admin@example.com"
              type="email"
              className="pl-10 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <Input
              required
              placeholder="••••••••"
              type={isVisible ? "text" : "password"}
              className="pl-10 w-full pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="button" 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground z-10"
              onClick={() => setIsVisible(!isVisible)}
            >
              {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between py-2">
          <Checkbox id="remember-me" defaultSelected>
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Content>
              <Label htmlFor="remember-me" className="text-sm font-medium">Remember me</Label>
            </Checkbox.Content>
          </Checkbox>
          <Link href="/auth/forgot-password" className="text-sm text-accent hover:underline font-medium">
            Forgot password?
          </Link>
        </div>

        <Button 
          variant="primary" 
          type="submit" 
          isPending={isLoading}
          className="w-full h-12 font-semibold"
        >
          {({isPending}) => (
            <>
              {isPending ? <Spinner color="current" size="sm" /> : "Sign In"}
            </>
          )}
        </Button>
      </form>
      
      <div className="text-center text-sm pt-2">
        <span className="text-muted">Don't have an account? </span>
        <Link href="/auth/register" className="text-accent hover:underline font-bold">
          Create an admin
        </Link>
      </div>
    </motion.div>
  );
}
