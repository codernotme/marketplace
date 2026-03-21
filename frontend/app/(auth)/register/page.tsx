'use client';
import { useState } from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { OTPInput } from '@/components/auth/OTPInput';

export default function RegisterPage() {
  const [emailToVerify, setEmailToVerify] = useState<string | null>(null);

  return (
    <div className="min-h-[calc(100vh-130px)] flex items-center justify-center py-12 px-4 bg-[--c-bg]">
      {emailToVerify ? (
        <OTPInput email={emailToVerify} />
      ) : (
        <RegisterForm onRegisterSuccess={(email) => setEmailToVerify(email)} />
      )}
    </div>
  );
}
