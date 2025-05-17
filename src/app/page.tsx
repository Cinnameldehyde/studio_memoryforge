
"use client";

import { useEffect, useState } from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { CallToActionSection } from '@/components/landing/CallToActionSection';
import { AppLogo } from '@/components/shared/AppLogo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isLoading && !isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden text-foreground">
      {/* Fixed background element */}
      <div
        className="fixed inset-0 z-[-1] bg-landing-gradient animate-gradient-x"
        aria-hidden="true"
      />

      <header className="sticky top-0 z-50 py-4 px-4 sm:px-8 bg-background/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <AppLogo className="text-2xl" />
          <nav className="space-x-4">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : user ? (
              <Button asChild variant="default" className="bg-primary hover:bg-primary-gradient text-primary-foreground">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="hover:text-primary">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild variant="default" className="bg-primary hover:bg-primary-gradient text-primary-foreground">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Content wrapper that will scroll */}
      <main className="flex-grow relative z-0"> {/* Ensure main content is above the fixed background */}
        <HeroSection />
        <FeaturesSection />
        <CallToActionSection />
      </main>

      <footer className="
        py-12 text-center text-muted-foreground relative z-0
        before:content-['']
        before:absolute before:inset-x-0 before:bottom-0 before:h-full
        before:bg-gradient-to-t before:from-black/70 before:to-transparent
        before:z-[-1] before:pointer-events-none
      ">
        <div className="container mx-auto relative"> {/* Ensure content is above pseudo-element */}
          <AppLogo className="text-xl justify-center mb-4" />
          <p>&copy; {new Date().getFullYear()} MemoryForge. All rights reserved.</p>
          <p className="text-sm mt-2">Forge Your Knowledge, Master Your Mind.</p>
        </div>
      </footer>
    </div>
  );
}
