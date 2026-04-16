"use client";

import { LoginForm } from "@workspace/ui/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Super Admin</h1>
        <p className="text-sm text-muted-foreground">
          Identify yourself to access the platform root
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
