'use client';
import { useState, useRef } from "react";
import { Input, Button } from "@/components/HeroUI";
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';

export const OTPInput = ({ email }: { email: string }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { login } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
      await new Promise(r => setTimeout(r, 800));
      login({ accessToken: 'mock-token', refreshToken: 'mock-refresh' }, {
        id: 'u1',
        name: 'John Doe',
        email
      });
      router.push('/');
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

      <button className="text-sm font-medium text-[--c-muted] hover:text-[--c-primary] transition-colors mt-2">
        Resend code
      </button>
    </div>
  );
};
