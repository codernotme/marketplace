'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input, Button, Link as HeroLink } from '@/components/HeroUI';
import { useState } from 'react';
import Link from 'next/link';

const resetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ResetSchema = z.infer<typeof resetSchema>;

export const ForgotPasswordForm = () => {
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetSchema>({
    resolver: zodResolver(resetSchema)
  });

  const onSubmit = async (data: ResetSchema) => {
    // API mock
    await new Promise(resolve => setTimeout(resolve, 800));
    setSuccess(true);
  };

  const inputClassNames = {
    label: "text-[11px] font-medium tracking-[0.15em] uppercase text-[--c-secondary] mb-1",
    inputWrapper: "bg-white border border-[--c-border] rounded-xl hover:border-[--c-border-hover] focus-within:border-[--c-primary] focus-within:bg-white shadow-none transition-all duration-200 h-12",
    input: "text-sm text-[--c-primary] placeholder:text-[--c-muted]",
    errorMessage: "text-xs text-[--c-danger] mt-1",
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white border border-[--c-border] rounded-2xl shadow-sm text-center">
      <div className="mb-8">
        <h1 className="font-display text-3xl mb-2 text-[--c-primary]">Reset Password</h1>
        <p className="text-[--c-secondary] text-sm">
          {success ? "Check your email for a link to reset your password." : "Enter your email and we'll send you a link to reset your password."}
        </p>
      </div>

      {!success ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
          <Input
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            labelPlacement="outside"
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
            classNames={inputClassNames}
            {...register('email')}
          />

          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full bg-[--c-primary] text-white rounded-full h-12 text-sm font-medium tracking-wide mt-4"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      ) : (
        <Button
          as={Link}
          href="/login"
          className="w-full bg-[--c-surface] text-[--c-primary] hover:bg-[--c-border] rounded-full h-12 text-sm font-medium tracking-wide mt-4"
        >
          Return to Login
        </Button>
      )}

      {!success && (
        <div className="text-center text-sm text-[--c-secondary] mt-6">
          <HeroLink as={Link} href="/login" className="text-[--c-primary] font-medium">← Back to login</HeroLink>
        </div>
      )}
    </div>
  );
};
