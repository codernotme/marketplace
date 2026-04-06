'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input, Button } from '@/components/HeroUI';
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
    await new Promise(resolve => setTimeout(resolve, 800));
    onRegisterSuccess(data.email);
  };

  const inputClassNames = {
    label: "text-xs font-semibold text-gray-500 mb-1",
    inputWrapper: "bg-[#F5F5F5] border-transparent rounded-xl focus-within:bg-[#EBEBEB] focus-within:border-black transition-all h-14 px-4",
    input: "text-base text-black font-medium placeholder:text-gray-400",
    errorMessage: "text-xs text-red-500 mt-1",
  };

  return (
    <div className="w-full flex flex-col pt-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight text-black mb-2">New account</h1>
        <p className="font-body text-gray-500 text-base">Please enter your details to sign up.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          type="text"
          label="Full Name"
          placeholder="Enter full name"
          labelPlacement="outside"
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message}
          classNames={inputClassNames}
          {...register('name')}
        />

        <Input
          type="email"
          label="Email"
          placeholder="Enter email"
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
            <button type="button" onClick={() => setShowPassword(s => !s)} className="text-gray-400 hover:text-black transition-colors">
              <Icon icon={showPassword ? "lucide:eye-off" : "lucide:eye"} className="text-xl" />
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
          className="w-full bg-black text-white rounded-2xl h-14 text-lg font-bold mt-6 hover:scale-[1.02] transition-transform"
        >
          {isSubmitting ? "Creating..." : "Sign Up"}
        </Button>
      </form>

      <div className="flex items-center gap-4 my-8">
        <hr className="flex-1 border-gray-200" />
        <span className="font-body text-xs font-semibold uppercase text-gray-400">or continue with</span>
        <hr className="flex-1 border-gray-200" />
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <button className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <Icon icon="logos:google-icon" className="text-2xl" />
        </button>
        <button className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <Icon icon="logos:facebook" className="text-2xl" />
        </button>
        <button className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors text-black">
          <Icon icon="mdi:apple" className="text-3xl" />
        </button>
      </div>

      <div className="text-center font-body text-sm font-medium text-gray-500">
        Already have an account? <Link href="/login" className="text-black font-bold ml-1 hover:underline">Log in</Link>
      </div>
    </div>
  );
};
