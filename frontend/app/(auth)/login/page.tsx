'use client';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useState } from 'react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-body">
      {/* Left Panel - Visual */}
      <div className="relative w-full lg:w-1/2 bg-black overflow-hidden min-h-[300px] lg:min-h-screen hidden lg:flex flex-col justify-between p-12">
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80"
          alt="Shop"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-transparent" />
        
        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#84D347] rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-lg">m</span>
          </div>
          <span className="font-display font-black text-white text-xl tracking-tight">themrktplace</span>
        </div>

        {/* Testimonial */}
        <div className="relative z-10">
          <div className="flex gap-1 mb-3">
            {[1,2,3,4,5].map(s => <Icon key={s} icon="mdi:star" className="text-[#FFB800] text-lg" />)}
          </div>
          <p className="font-body text-white text-xl leading-relaxed mb-4">
            "The most seamless shopping experience I've ever had. Premium products, authentic brands."
          </p>
          <div className="flex items-center gap-3">
            <img src="https://i.pravatar.cc/48?img=5" alt="User" className="w-10 h-10 rounded-full border-2 border-[#84D347]" />
            <div>
              <p className="font-bold text-white text-sm">Sofia Reyes</p>
              <p className="text-gray-400 text-xs">Verified Buyer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-16 xl:p-24 bg-white">
        
        {/* Mobile Logo */}
        <div className="flex lg:hidden items-center gap-2 mb-10">
          <div className="w-7 h-7 bg-black rounded flex items-center justify-center">
            <span className="text-white font-black">m</span>
          </div>
          <span className="font-display font-black text-black text-xl tracking-tight">themrktplace</span>
        </div>

        <Link href="/" className="hidden lg:flex items-center gap-2 text-gray-400 hover:text-black transition-colors text-sm font-medium mb-12 w-fit">
          <Icon icon="lucide:arrow-left" /> Back to home
        </Link>

        <div className="max-w-md w-full mx-auto lg:mx-0">
          <h1 className="font-display text-4xl font-bold text-black tracking-tight mb-2">Welcome back</h1>
          <p className="text-gray-500 font-body mb-8">Sign into your account to continue shopping.</p>

          {/* Social Sign-in */}
          <div className="mb-8">
            <button className="w-full flex items-center justify-center gap-2 border-2 border-gray-100 rounded-xl h-12 font-semibold text-sm text-black hover:border-gray-300 transition-colors hover:bg-gray-50">
              <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg> Continue with Google
            </button>
          </div>

          <div className="relative flex items-center mb-8">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="px-4 text-xs text-gray-400 font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Form */}
          <form className="flex flex-col gap-5">
            <div>
              <label className="font-semibold text-sm text-black block mb-2">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-2xl px-5 h-12 text-black font-body outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-all text-sm"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-semibold text-sm text-black">Password</label>
                <Link href="/forgot-password" className="text-xs text-[#84D347] font-semibold hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-2xl px-5 h-12 text-black font-body outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-all text-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  <Icon icon={showPassword ? 'mdi:eye-off' : 'mdi:eye'} className="text-xl" />
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full h-14 bg-black text-white font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-lg text-base"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-black font-bold hover:text-[#84D347] transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
