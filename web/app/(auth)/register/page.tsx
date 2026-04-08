'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { fetchStorefrontContent } from '@/lib/api';

const defaultContent = {
  brand: { siteName: 'theMrktPlace' },
  auth: {
    register: {
      visualImage: '/images/auth/register.jpg',
      visualHeading: 'Create your account',
      visualFeatures: [],
      backHomeLabel: 'Back to Home',
      title: 'Create Account',
      subtitle: 'Get started in minutes',
      googleLabel: 'Continue with Google',
      dividerLabel: 'or sign up with email',
      firstNameLabel: 'First Name',
      firstNamePlaceholder: 'John',
      lastNameLabel: 'Last Name',
      lastNamePlaceholder: 'Doe',
      emailLabel: 'Email',
      emailPlaceholder: 'you@example.com',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Create password',
      termsPrefix: 'I agree to the',
      termsLabel: 'Terms',
      privacyLabel: 'Privacy Policy',
      submitLabel: 'Create Account',
      switchPrompt: 'Already have an account?',
      switchActionLabel: 'Sign in',
    },
  },
};

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [storefrontContent, setStorefrontContent] = useState<any>(defaultContent);
  const content = storefrontContent.auth.register;
  const brand = storefrontContent.brand;

  useEffect(() => {
    const loadStorefront = async () => {
      const response = await fetchStorefrontContent();
      if (response && typeof response === 'object') {
        setStorefrontContent({
          ...defaultContent,
          ...response,
          auth: {
            ...defaultContent.auth,
            ...((response as any).auth ?? {}),
          },
        });
      }
    };
    loadStorefront();
  }, []);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-body">
      {/* Left Panel - Visual */}
      <div className="relative w-full lg:w-1/2 bg-black overflow-hidden hidden lg:flex flex-col justify-between p-12">
        <img
          src={content.visualImage}
          alt="Shop"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-transparent" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <Image src="/logo.svg" alt={brand.siteName} width={96} height={38} className="h-8 w-auto" priority />
        </div>

        {/* Feature list */}
        <div className="relative z-10">
          <h2 className="font-display text-3xl font-bold text-white mb-6">{content.visualHeading}</h2>
          <ul className="flex flex-col gap-4">
            {content.visualFeatures.map((item: any) => (
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
          <Image src="/logo.svg" alt={brand.siteName} width={96} height={38} className="h-8 w-auto" />
        </div>

        <Link href="/" className="hidden lg:flex items-center gap-2 text-gray-400 hover:text-black transition-colors text-sm font-medium mb-10 w-fit">
          <Icon icon="lucide:arrow-left" /> {content.backHomeLabel}
        </Link>

        <div className="max-w-md w-full mx-auto lg:mx-0">
          <h1 className="font-display text-4xl font-bold text-black tracking-tight mb-2">{content.title}</h1>
          <p className="text-gray-500 font-body mb-8">{content.subtitle}</p>

          {/* Social Sign-up */}
          <div className="mb-8">
            <button className="w-full flex items-center justify-center gap-2 border-2 border-gray-100 rounded-xl h-12 font-semibold text-sm text-black hover:border-gray-300 transition-colors hover:bg-gray-50">
              <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg> {content.googleLabel}
            </button>
          </div>

          <div className="relative flex items-center mb-8">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="px-4 text-xs text-gray-400 font-medium">{content.dividerLabel}</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <form className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-sm text-black block mb-2">{content.firstNameLabel}</label>
                <input type="text" placeholder={content.firstNamePlaceholder} className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-2xl px-5 h-12 text-black outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-all text-sm" />
              </div>
              <div>
                <label className="font-semibold text-sm text-black block mb-2">{content.lastNameLabel}</label>
                <input type="text" placeholder={content.lastNamePlaceholder} className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-2xl px-5 h-12 text-black outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-all text-sm" />
              </div>
            </div>
            <div>
              <label className="font-semibold text-sm text-black block mb-2">{content.emailLabel}</label>
              <input type="email" placeholder={content.emailPlaceholder} className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-2xl px-5 h-12 text-black outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-all text-sm" />
            </div>
            <div>
              <label className="font-semibold text-sm text-black block mb-2">{content.passwordLabel}</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={content.passwordPlaceholder}
                  className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-2xl px-5 h-12 text-black outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-all text-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  <Icon icon={showPassword ? 'mdi:eye-off' : 'mdi:eye'} className="text-xl" />
                </button>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <input type="checkbox" id="terms" className="mt-0.5 w-4 h-4 accent-black flex-shrink-0" />
              <label htmlFor="terms" className="text-sm text-gray-500">
                {content.termsPrefix}{' '}
                <Link href="/terms" className="text-black font-semibold hover:text-[#84D347]">{content.termsLabel}</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-black font-semibold hover:text-[#84D347]">{content.privacyLabel}</Link>
              </label>
            </div>
            <button type="submit" className="w-full h-14 bg-black text-white font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-lg text-base mt-2">
              {content.submitLabel}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            {content.switchPrompt}{' '}
            <Link href="/login" className="text-black font-bold hover:text-[#84D347] transition-colors">
              {content.switchActionLabel}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
