'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input, Button, Checkbox, Link as HeroLink } from '@/components/HeroUI';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Minimum 8 characters required'),
  remember: z.boolean().optional(),
});

type LoginSchema = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginSchema) => {
    // API mock
    await new Promise(resolve => setTimeout(resolve, 800));
    login({ accessToken: 'mock-token', refreshToken: 'mock-refresh' }, {
      id: 'u1',
      name: 'John Doe',
      email: data.email
    });
    router.push('/');
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
        <h1 className="font-display text-3xl mb-2 text-[--c-primary]">Welcome Back</h1>
        <p className="text-[--c-secondary] text-sm">Enter your details to access your account.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

        <div className="flex items-center justify-between py-2">
          <Checkbox size="sm" classNames={{ label: "text-sm text-[--c-secondary]", wrapper: "rounded-sm border-[--c-border-hover] data-[selected=true]:bg-[--c-primary] data-[selected=true]:border-[--c-primary]" }} {...register('remember')}>
            Remember me
          </Checkbox>
          <HeroLink as={Link} href="/forgot-password" size="sm" className="text-[--c-secondary] hover:text-[--c-primary]">
            Forgot password?
          </HeroLink>
        </div>

        <Button
          type="submit"
          isLoading={isSubmitting}
          className="w-full bg-[--c-primary] text-white rounded-full h-12 text-sm font-medium tracking-wide mt-4"
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </Button>

        <div className="text-center text-sm text-[--c-secondary] mt-6">
          Don't have an account? <HeroLink as={Link} href="/register" className="text-[--c-primary] font-medium ml-1">Sign up</HeroLink>
        </div>
      </form>
    </div>
  );
};
