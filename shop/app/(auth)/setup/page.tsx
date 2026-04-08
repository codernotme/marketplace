"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Label } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useShopAuthStore } from "@/lib/auth-store";

const siteName = "theMrktPlace";

export default function SetupPage() {
  const router = useRouter();
  const { register, verifyEmailOtp, isLoading, error, clearError } = useShopAuthStore();
  const [registered, setRegistered] = useState(false);
  const [otp, setOtp] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    storeName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      clearError();
      const name = `${form.firstName} ${form.lastName}`.trim();
      await register({
        name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
      });
      setRegistered(true);
    } catch {
      // Error is already reflected by auth store.
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      clearError();
      await verifyEmailOtp(form.email, otp);
      router.push("/dashboard");
    } catch {
      // Error is already reflected by auth store.
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Form Side */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 order-2 lg:order-1">
        <div className="w-full max-w-[440px]">
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-lg shadow-accent/40">
              <Image src="/logo.svg" alt="Logo" width={32} height={32} />
            </div>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black mb-3" style={{ fontFamily: "var(--font-outfit)" }}>Get Started</h2>
            <p className="text-muted text-sm">Create your administrator account and start growing your platform.</p>
          </div>

          {!registered ? (
            <form onSubmit={handleRegister} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1">First Name</Label>
                <input
                  id="firstName"
                  placeholder="John"
                  required
                  value={form.firstName}
                  onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
                  className="w-full bg-default/40 border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1">Last Name</Label>
                <input
                  id="lastName"
                  placeholder="Doe"
                  required
                  value={form.lastName}
                  onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
                  className="w-full bg-default/40 border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeName" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1">Store Name</Label>
              <input
                id="storeName"
                placeholder="My Awesome Store"
                required
                value={form.storeName}
                onChange={(e) => setForm((prev) => ({ ...prev, storeName: e.target.value }))}
                className="w-full bg-default/40 border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1">Work Email</Label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full bg-default/40 border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1">Phone (Optional)</Label>
              <input
                id="phone"
                type="tel"
                placeholder="9876543210"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full bg-default/40 border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1">Create Password</Label>
              <input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                minLength={8}
                required
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full bg-default/40 border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-all duration-200"
              />
            </div>

            {error ? <p className="text-xs text-danger font-bold">{error}</p> : null}

            <div className="flex items-start gap-2 px-1 py-1">
              <input type="checkbox" id="terms" className="mt-1 w-4 h-4 rounded border-border text-accent focus:ring-accent accent-accent" required />
              <Label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                I agree to the <Link href="#" className="font-bold text-accent hover:underline">Terms of Service</Link> and <Link href="#" className="font-bold text-accent hover:underline">Privacy Policy</Link>.
              </Label>
            </div>

            <Button
              type="submit"
              variant="primary"
              isPending={isLoading}
              className="w-full py-4 rounded-2xl shadow-xl shadow-accent/20 font-bold"
            >
              Initialize My Dashboard
            </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="rounded-2xl border border-accent/25 bg-accent/5 p-4 text-xs text-muted">
                We sent a 6-digit OTP to <span className="font-bold text-foreground">{form.email}</span>. Verify it to activate your account.
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1">Email OTP</Label>
                <input
                  id="otp"
                  placeholder="123456"
                  minLength={6}
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full bg-default/40 border border-border rounded-2xl px-4 py-3 text-sm tracking-[0.3em] font-bold text-center focus:outline-none focus:border-accent transition-all duration-200"
                />
              </div>

              {error ? <p className="text-xs text-danger font-bold">{error}</p> : null}

              <Button
                type="submit"
                variant="primary"
                isPending={isLoading}
                className="w-full py-4 rounded-2xl shadow-xl shadow-accent/20 font-bold"
              >
                Verify & Open Dashboard
              </Button>

              <Button
                type="button"
                variant="secondary"
                className="w-full py-4 rounded-2xl font-bold"
                onPress={() => setRegistered(false)}
              >
                Edit Registration Details
              </Button>
            </form>
          )}

          <p className="text-center mt-8 text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-accent font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Visual Side */}
      <div className="hidden lg:flex flex-1 relative bg-accent/5 overflow-hidden order-1 lg:order-2">
        <div className="absolute inset-0 bg-gradient-to-tl from-accent/20 via-transparent to-violet-500/10" />
        <div className="absolute inset-0 flex flex-col justify-between p-12 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/40">
              <Image src="/logo.svg" alt="Logo" width={24} height={24} />
            </div>
            <span className="text-xl font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>
              {siteName}
            </span>
          </div>

          <div className="max-w-md self-end text-right">
            <h1 className="text-6xl font-black mb-8 leading-tight tracking-tighter" style={{ fontFamily: "var(--font-outfit)" }}>
              Scale <span className="text-accent underline decoration-4 underline-offset-8">Faster</span>.
            </h1>

            <div className="space-y-6">
              {[
                { icon: "solar:rocket-bold-duotone", title: "Instant Deployment", text: "Go live with your store in minutes, not days." },
                { icon: "solar:ranking-bold-duotone", title: "Real-time Insights", text: "Track your growth with world-class analytics." },
                { icon: "solar:shield-check-bold-duotone", title: "Bank-level Security", text: "Your data is protected by industry leaders." }
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-4 justify-end text-right">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                    <p className="text-muted text-sm">{feature.text}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-surface border border-accent/20 shadow-xl flex items-center justify-center text-accent flex-shrink-0">
                    <Icon icon={feature.icon} className="text-2xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-muted">
            Join the elite 1% of global marketplace owners.
          </p>
        </div>

        {/* Abstract shapes */}
        <div className="absolute top-1/3 -left-20 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 -right-20 w-96 h-96 bg-violet-500/20 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
