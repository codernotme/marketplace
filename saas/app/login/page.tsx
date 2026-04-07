"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSaasAuthStore } from "@/store/saas-auth.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useSaasAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    if (!email || !password) {
      setLocalError("Please fill in all fields");
      return;
    }

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setLocalError(error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-muted/30 to-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo & Branding */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <Image src="/logo.svg" alt="theMrktPlace" width={108} height={42} className="h-10 w-auto" priority />
          </div>
          <h1 className="text-3xl font-bold text-foreground">theMrktPlace</h1>
          <p className="text-muted-foreground">SaaS Admin Dashboard</p>
        </div>

        {/* Login Card */}
        <Card className="border-border bg-card shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-foreground">Welcome back</CardTitle>
            <CardDescription>Sign in to your admin account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Alert */}
            {(localError || error) && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{localError || error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@themrktplace.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="bg-muted border-border text-foreground placeholder-muted-foreground"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-orange-500 hover:text-orange-400 transition"
                  >
                    Forgot?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="bg-muted border-border text-foreground placeholder-muted-foreground"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-foreground to-muted-foreground hover:from-foreground/90 hover:to-muted-foreground/90 text-background font-medium h-10"
              >
                {isLoading ? (
                  <>
                    <Spinner className="mr-2 w-4 h-4" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 w-4 h-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              No admin account yet?{" "}
              <Link href="/signup" className="text-orange-500 hover:text-orange-400 transition">
                Create one
              </Link>
            </div>

            {/* Demo Credentials */}
            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground mb-2">Demo Credentials:</p>
              <div className="bg-muted rounded p-3 space-y-1 text-xs font-mono text-muted-foreground">
                <p>Email: admin@themrktplace.com</p>
                <p>Password: demo123456</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Need help?{" "}
          <a href="mailto:support@themrktplace.com" className="text-orange-500 hover:text-orange-400">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}

