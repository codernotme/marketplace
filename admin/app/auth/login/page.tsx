"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button, Input, Checkbox } from "@heroui/react";
import { Mail, Lock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
      <div className="flex flex-col space-y-2 text-center lg:text-left">
        <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
        <p className="text-sm text-default-500">
          Enter your credentials to access the admin panel.
        </p>
      </div>

      {error && (
        <div className="p-3 text-sm text-danger-600 bg-danger-50 flex items-center gap-2 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          isRequired
          label="Email"
          placeholder="admin@example.com"
          type="email"
          variant="faded"
          value={email}
          onValueChange={setEmail}
          startContent={<Mail className="w-4 h-4 text-default-400" />}
        />
        
        <Input
          isRequired
          label="Password"
          placeholder="••••••••"
          type="password"
          variant="faded"
          value={password}
          onValueChange={setPassword}
          startContent={<Lock className="w-4 h-4 text-default-400" />}
        />

        <div className="flex items-center justify-between">
          <Checkbox defaultSelected size="sm" color="primary">Remember me</Checkbox>
          <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline font-medium">
            Forgot password?
          </Link>
        </div>

        <Button 
          fullWidth 
          color="primary" 
          type="submit" 
          isLoading={loading}
          className="mt-4 font-medium h-12"
        >
          Sign In
        </Button>
      </form>
      
      <div className="text-center text-sm">
        <span className="text-default-500">Don't have an account? </span>
        <Link href="/auth/register" className="text-primary hover:underline font-medium">
          Create an admin
        </Link>
      </div>
    </motion.div>
  );
}
