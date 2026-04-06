import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | theMrktPlace SaaS",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
