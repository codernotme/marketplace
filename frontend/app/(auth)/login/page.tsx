import { LoginForm } from '@/components/auth/LoginForm';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left side: Graphic/Splash (Hidden on very small screens, or stacked) */}
      <div className="w-full md:w-1/2 bg-[#F5F5F5] flex flex-col items-center justify-center p-12 relative overflow-hidden hidden sm:flex">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-multiply"></div>
         <div className="relative z-10 max-w-sm text-center">
            <div className="w-16 h-16 bg-[#84D347] rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
               <Icon icon="mdi:shopping" className="text-white text-3xl" />
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-black mb-6">
              Welcome to the most innovative digital store.
            </h1>
            <p className="font-body text-gray-600 text-lg">
              Curated everyday essentials, authentic quality, and a seamless shopping experience.
            </p>
         </div>
      </div>
      
      {/* Right side: Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-white relative">
         <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-black font-body font-medium transition-colors">
            <Icon icon="lucide:arrow-left" className="text-xl" /> Back to Home
         </Link>
         <div className="w-full max-w-md mt-12 md:mt-0">
            <LoginForm />
         </div>
      </div>
    </div>
  );
}
