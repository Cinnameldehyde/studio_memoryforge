
"use client";

import { AppLogo } from '@/components/shared/AppLogo';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';

export default function AuthLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginView = pathname === '/login';

  // min-h-[600px] or a specific height might be needed if forms have different heights
  // to prevent layout shifts during the flip. For now, we assume forms are similarly sized.
  // The Card component inside LoginForm/SignupForm provides the actual visual card.
  const cardWrapperMinHeight = "min-h-[600px]"; // Adjusted based on typical form height, increased for Google button text

  return (
    <>
      <div 
        className="fixed inset-0 z-[-1] bg-landing-gradient animate-gradient-x" 
        aria-hidden="true" 
      />
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-transparent">
        <div className="mb-6">
          <AppLogo className="text-3xl !text-white text-shadow" />
        </div>
        <div className={`w-full max-w-md perspective ${cardWrapperMinHeight}`}>
          <div
            className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-700 ease-in-out ${
              isLoginView ? '' : 'rotate-y-180'
            }`}
          >
            {/* Front Face: Login Form */}
            <div className="absolute inset-0 backface-hidden">
              <LoginForm />
            </div>
            {/* Back Face: Signup Form */}
            <div className="absolute inset-0 backface-hidden transform rotate-y-180">
              <SignupForm />
            </div>
          </div>
        </div>
        {/* Render children if necessary for other auth routes, or remove if only login/signup use this specific flip */}
        {/* For this flip animation, children from page.tsx are not directly used inside the card */}
      </div>
    </>
  );
}
