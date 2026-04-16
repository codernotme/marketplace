"use client";

import { SignupForm } from "@workspace/ui/components/auth/signup-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your information to get started with your marketplace
        </p>
      </div>
      <SignupForm defaultRole="TENANT_OWNER" />
      <p className="px-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link 
          href="/login" 
          className="underline underline-offset-4 hover:text-primary"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
