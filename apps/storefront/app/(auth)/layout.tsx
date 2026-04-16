import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
