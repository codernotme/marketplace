'use client';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9] p-6 font-body">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm p-10">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-lg">m</span>
          </div>
          <span className="font-display font-black text-black text-xl tracking-tight">themrktplace</span>
        </div>

        {!sent ? (
          <>
            <div className="w-16 h-16 bg-[#F5F5F5] rounded-2xl flex items-center justify-center mb-6">
              <Icon icon="mdi:lock-reset" className="text-3xl text-black" />
            </div>
            <h1 className="font-display text-3xl font-bold text-black mb-2">Forgot Password?</h1>
            <p className="text-gray-500 text-sm mb-8">No worries! Enter your email and we'll send you a reset link.</p>
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="flex flex-col gap-5">
              <div>
                <label className="font-semibold text-sm text-black block mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-xl px-4 h-12 text-black outline-none focus:border-black focus:bg-white transition-all text-sm"
                />
              </div>
              <button type="submit" className="w-full h-14 bg-black text-white font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-lg text-base">
                Send Reset Link
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-20 h-20 bg-[#84D347]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon icon="mdi:email-check-outline" className="text-4xl text-[#84D347]" />
            </div>
            <h2 className="font-display text-2xl font-bold text-black mb-2">Check your inbox!</h2>
            <p className="text-gray-500 text-sm mb-8">We've sent a password reset link to your email address. It expires in 30 minutes.</p>
            <button onClick={() => setSent(false)} className="text-sm font-semibold text-gray-400 hover:text-black transition-colors">
              Didn't receive it? Try again
            </button>
          </div>
        )}

        <Link href="/login" className="flex items-center justify-center gap-2 text-gray-400 hover:text-black transition-colors text-sm font-medium mt-8">
          <Icon icon="lucide:arrow-left" /> Back to Login
        </Link>
      </div>
    </div>
  );
}
