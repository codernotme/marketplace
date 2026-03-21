'use client';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useState } from 'react';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-body">
      {/* Left Panel - Visual */}
      <div className="relative w-full lg:w-1/2 bg-black overflow-hidden hidden lg:flex flex-col justify-between p-12">
        <img
          src="https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=1200&q=80"
          alt="Shop"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-transparent" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#84D347] rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-lg">m</span>
          </div>
          <span className="font-display font-black text-white text-xl tracking-tight">themrktplace</span>
        </div>

        {/* Feature list */}
        <div className="relative z-10">
          <h2 className="font-display text-3xl font-bold text-white mb-6">Join 50,000+ happy shoppers</h2>
          <ul className="flex flex-col gap-4">
            {[
              { icon: 'mdi:truck-delivery-outline', text: 'Free shipping on orders over $100' },
              { icon: 'mdi:shield-check-outline', text: 'Verified authentic products only' },
              { icon: 'mdi:rotate-left', text: '30-day easy returns' },
              { icon: 'mdi:tag-outline', text: 'Exclusive member-only deals' },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-3 text-white">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon icon={item.icon} className="text-[#84D347] text-lg" />
                </div>
                <span className="font-body font-medium text-sm">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-16 xl:p-20 bg-white overflow-y-auto">

        {/* Mobile Logo */}
        <div className="flex lg:hidden items-center gap-2 mb-10">
          <div className="w-7 h-7 bg-black rounded flex items-center justify-center">
            <span className="text-white font-black">m</span>
          </div>
          <span className="font-display font-black text-black text-xl tracking-tight">themrktplace</span>
        </div>

        <Link href="/" className="hidden lg:flex items-center gap-2 text-gray-400 hover:text-black transition-colors text-sm font-medium mb-10 w-fit">
          <Icon icon="lucide:arrow-left" /> Back to home
        </Link>

        <div className="max-w-md w-full mx-auto lg:mx-0">
          <h1 className="font-display text-4xl font-bold text-black tracking-tight mb-2">Create account</h1>
          <p className="text-gray-500 font-body mb-8">Start your premium shopping experience today.</p>

          {/* Social Sign-up */}
          <div className="flex gap-3 mb-8">
            <button className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-100 rounded-xl h-12 font-semibold text-sm text-black hover:border-gray-300 transition-colors hover:bg-gray-50">
              <Icon icon="mdi:google" className="text-xl text-red-500" /> Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-100 rounded-xl h-12 font-semibold text-sm text-black hover:border-gray-300 transition-colors hover:bg-gray-50">
              <Icon icon="mdi:apple" className="text-xl" /> Apple
            </button>
          </div>

          <div className="relative flex items-center mb-8">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="px-4 text-xs text-gray-400 font-medium">or sign up with email</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <form className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-sm text-black block mb-2">First Name</label>
                <input type="text" placeholder="Jane" className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-xl px-4 h-12 text-black outline-none focus:border-black focus:bg-white transition-all text-sm" />
              </div>
              <div>
                <label className="font-semibold text-sm text-black block mb-2">Last Name</label>
                <input type="text" placeholder="Doe" className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-xl px-4 h-12 text-black outline-none focus:border-black focus:bg-white transition-all text-sm" />
              </div>
            </div>
            <div>
              <label className="font-semibold text-sm text-black block mb-2">Email Address</label>
              <input type="email" placeholder="you@example.com" className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-xl px-4 h-12 text-black outline-none focus:border-black focus:bg-white transition-all text-sm" />
            </div>
            <div>
              <label className="font-semibold text-sm text-black block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-xl px-4 h-12 text-black outline-none focus:border-black focus:bg-white transition-all text-sm pr-12"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                  <Icon icon={showPassword ? 'mdi:eye-off' : 'mdi:eye'} className="text-xl" />
                </button>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <input type="checkbox" id="terms" className="mt-0.5 w-4 h-4 accent-black flex-shrink-0" />
              <label htmlFor="terms" className="text-sm text-gray-500">
                I agree to the{' '}
                <Link href="/terms" className="text-black font-semibold hover:text-[#84D347]">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/terms" className="text-black font-semibold hover:text-[#84D347]">Privacy Policy</Link>
              </label>
            </div>
            <button type="submit" className="w-full h-14 bg-black text-white font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-lg text-base mt-2">
              Create Account
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-black font-bold hover:text-[#84D347] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
