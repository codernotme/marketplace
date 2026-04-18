"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button, Input } from "@heroui/react";
import { Mail, Lock, User, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        callbackURL: "/dashboard"
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
        <h2 className="text-3xl font-bold tracking-tight">Create an Account</h2>
        <p className="text-sm text-default-500">
          Join us to track orders, save items, and earn rewards.
        </p>
      </div>

      {error && (
        <div className="p-3 text-sm text-danger-600 bg-danger-50 flex items-center gap-2 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <Input
          isRequired
          label="Full Name"
          placeholder="Jane Doe"
          variant="faded"
          value={name}
          onValueChange={setName}
          startContent={<User className="w-4 h-4 text-default-400" />}
        />

        <Input
          isRequired
          label="Email"
          placeholder="jane@example.com"
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

        <Button 
          fullWidth 
          color="primary" 
          type="submit" 
          isLoading={loading}
          className="mt-4 font-medium h-12"
        >
          Create Account
        </Button>
      </form>
      
      <div className="text-center text-sm">
        <span className="text-default-500">Already a customer? </span>
        <Link href="/auth/login" className="text-primary hover:underline font-medium">
          Sign In
        </Link>
      </div>
    </motion.div>
  );
}
