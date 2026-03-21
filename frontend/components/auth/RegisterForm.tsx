'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input, Button, Link as HeroLink } from '@/components/HeroUI';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import Link from 'next/link';

const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Minimum 8 characters required'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterSchema = z.infer<typeof registerSchema>;

export const RegisterForm = ({ onRegisterSuccess }: { onRegisterSuccess: (email: string) => void }) => {
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterSchema) => {
    // API mock
    await new Promise(resolve => setTimeout(resolve, 800));
    onRegisterSuccess(data.email);
  };

  const inputClassNames = {
    label: "text-[11px] font-medium tracking-[0.15em] uppercase text-[--c-secondary] mb-1",
    inputWrapper: "bg-white border border-[--c-border] rounded-xl hover:border-[--c-border-hover] focus-within:border-[--c-primary] focus-within:bg-white shadow-none transition-all duration-200 h-12",
    input: "text-sm text-[--c-primary] placeholder:text-[--c-muted]",
    errorMessage: "text-xs text-[--c-danger] mt-1",
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white border border-[--c-border] rounded-2xl shadow-sm">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl mb-2 text-[--c-primary]">Create Account</h1>
        <p className="text-[--c-secondary] text-sm">Join the marketplace today.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          type="text"
          label="Full Name"
          placeholder="John Doe"
          labelPlacement="outside"
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message}
          classNames={inputClassNames}
          {...register('name')}
        />

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

        <Input
          type={showPassword ? "text" : "password"}
          label="Password"
          placeholder="Min. 8 characters"
          labelPlacement="outside"
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
          classNames={inputClassNames}
          endContent={
            <button type="button" onClick={() => setShowPassword(s => !s)} className="text-[--c-muted] hover:text-[--c-primary] transition-colors">
              <Icon icon={showPassword ? "lucide:eye-off" : "lucide:eye"} className="text-lg" />
            </button>
          }
          {...register('password')}
        />

        <Input
          type={showPassword ? "text" : "password"}
          label="Confirm Password"
          placeholder="Re-enter password"
          labelPlacement="outside"
          isInvalid={!!errors.confirmPassword}
          errorMessage={errors.confirmPassword?.message}
          classNames={inputClassNames}
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          isLoading={isSubmitting}
          className="w-full bg-[--c-primary] text-white rounded-full h-12 text-sm font-medium tracking-wide mt-4"
        >
          {isSubmitting ? "Creating..." : "Create Account"}
        </Button>

        <div className="text-center text-sm text-[--c-secondary] mt-6">
          Already have an account? <HeroLink as={Link} href="/login" className="text-[--c-primary] font-medium ml-1">Sign in</HeroLink>
        </div>
      </form>
    </div>
  );
};
