
"use client";

import { AppLogo } from '@/components/shared/AppLogo';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { APP_NAME } from '@/config/site';

export default function AuthLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginView = pathname === '/login';
  const cardWrapperMinHeight = "min-h-[600px]";

  return (
    <div className="flex min-h-screen flex-col bg-landing-gradient animate-gradient-x">
      <div className="fixed top-4 left-4 z-20">
        <Link href="/" passHref>
          <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white text-shadow-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center p-4 pt-16 sm:pt-20"> {/* Added padding-top */}
        <div className="mb-6">
           <Link href="/" aria-label="MemoryForge Home">
            <AppLogo className="text-3xl !text-white text-shadow" />
          </Link>
        </div>
        <div className={`w-full max-w-md perspective ${cardWrapperMinHeight}`}>
          <div
            className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-700 ease-in-out ${
              isLoginView ? '' : 'rotate-y-180'
            }`}
          >
            <div className="absolute inset-0 backface-hidden">
              <LoginForm />
            </div>
            <div className="absolute inset-0 backface-hidden transform rotate-y-180">
              <SignupForm />
            </div>
          </div>
        </div>
      </div>

      <footer className="py-6 text-center text-xs text-white/80 text-shadow-sm bg-transparent">
        <div className="container mx-auto flex flex-col sm:flex-row justify-center items-center space-y-1 sm:space-y-0 sm:space-x-3">
          <span>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</span>
          <span className="hidden sm:inline opacity-50">|</span>
          <Link href="#" className="hover:underline text-white/90 hover:text-white">Privacy Policy</Link>
          <span className="hidden sm:inline opacity-50">|</span>
          <Link href="#" className="hover:underline text-white/90 hover:text-white">Terms & Conditions</Link>
          <span className="hidden sm:inline opacity-50">|</span>
          <Link href="#" className="hover:underline text-white/90 hover:text-white">Contact Us</Link>
        </div>
      </footer>
    </div>
  );
}
