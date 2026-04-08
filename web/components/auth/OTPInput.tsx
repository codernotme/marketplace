'use client';
import { useState, useRef } from "react";
import { Input, Button } from "@/components/HeroUI";
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000/api';
const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG ?? 'demo';

export const OTPInput = ({ email }: { email: string }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { login } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOTP = async () => {
    const code = otp.join("");
    if (code.length === 6) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/shop/auth/login/otp/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Tenant-Slug': TENANT_SLUG,
          },
          body: JSON.stringify({ email, otp: code }),
        });
        const data = await response.json();
        if (!response.ok || !data?.token || !data?.refresh_token || !data?.user) {
          throw new Error(data?.detail?.message || data?.message || 'OTP verification failed');
        }

        login(
          { accessToken: data.token, refreshToken: data.refresh_token },
          {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            avatar: data.user.avatar,
          }
        );
        router.push('/');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'OTP verification failed');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white border border-[--c-border] rounded-2xl shadow-sm text-center">
      <h1 className="font-display text-3xl mb-2 text-[--c-primary]">Verify Email</h1>
      <p className="text-[--c-secondary] text-sm mb-8">We sent a code to <span className="font-medium text-[--c-primary]">{email}</span></p>

      <div className="flex gap-2 justify-center mb-8">
        {otp.map((data, index) => (
          <Input
            key={index}
            type="text"
            maxLength={1}
            value={data}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            //@ts-ignore
            ref={(el) => (inputRefs.current[index] = el)}
            classNames={{
              input: "text-center text-lg font-mono font-semibold text-[--c-primary]",
              inputWrapper: "w-12 h-14 bg-white border border-[--c-border] rounded-xl focus-within:border-[--c-primary] shadow-none px-0"
            }}
          />
        ))}
      </div>

      <Button
        onPress={verifyOTP}
        isLoading={loading}
        isDisabled={otp.join("").length !== 6}
        className="w-full bg-[--c-primary] text-white rounded-full h-12 text-sm font-medium tracking-wide mb-4"
      >
        Verify Account
      </Button>

      {error ? <p className="text-sm text-red-500 mb-2">{error}</p> : null}

      <button className="text-sm font-medium text-[--c-muted] hover:text-[--c-primary] transition-colors mt-2">
        Resend code
      </button>
    </div>
  );
};
