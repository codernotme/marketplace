"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button, Input, Label, Spinner } from "@heroui/react";
import { Mail, Lock, User, AlertCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/dashboard",
      });
      
      if (error) {
        setError(error.message || "Failed to register.");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col space-y-6"
    >
      <div className="flex flex-col space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Create an Account</h2>
        <p className="text-sm text-muted">
          Join us to track orders, save items, and earn rewards.
        </p>
      </div>

      {error && (
        <div className="p-3 text-sm bg-danger/10 border border-danger/20 flex items-center gap-2 rounded-lg text-danger">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            <Input
              id="name"
              required
              placeholder="Jane Doe"
              className="pl-10 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            <Input
              id="email"
              required
              placeholder="jane@example.com"
              type="email"
              className="pl-10 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            <Input
              id="password"
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

        <Button
          variant="primary"
          type="submit"
          isPending={loading}
          className="w-full h-12 font-semibold mt-4"
        >
          {({ isPending }) => (
            <>
              {isPending ? <Spinner color="current" size="sm" /> : "Create Account"}
            </>
          )}
        </Button>
      </form>
      
      <div className="text-center text-sm pt-2">
        <span className="text-muted">Already a customer? </span>
        <Link href="/auth/login" className="text-accent hover:underline font-bold">
          Sign In
        </Link>
      </div>
    </motion.div>
  );
}
