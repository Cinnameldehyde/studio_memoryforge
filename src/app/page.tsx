
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
import Image from 'next/image';

// Simple parallax container
const ParallaxContainer = ({ children, speed = 0.1 }: { children: React.ReactNode, speed?: number }) => {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.pageYOffset * speed);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div style={{ transform: `translateY(${offsetY}px)` }} className="transition-transform duration-100 ease-out">
      {children}
    </div>
  );
};


// Floating element (conceptual, will use CSS for actual floating)
const FloatingElement = ({ className, children, initialX, initialY, animationDelay }: { className?: string, children: React.ReactNode, initialX?: string, initialY?: string, animationDelay?: string }) => {
  return (
    <div
      className={cn("absolute animate-float hover:animate-float-plus-hover transition-all duration-300", className)}
      style={{
        left: initialX,
        top: initialY,
        animationDelay: animationDelay,
      }}
    >
      {children}
    </div>
  );
};

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-900 text-foreground flex flex-col overflow-x-hidden">
      <header className="sticky top-0 z-50 py-4 px-4 sm:px-8 bg-background/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <AppLogo className="text-2xl" />
          <nav className="space-x-4">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : user ? (
              <Button asChild variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="hover:text-primary">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <div className="relative overflow-hidden"> {/* Container for floating elements */}
          {isClient && ( // Render floating elements only on client-side to avoid hydration issues with random positions/animations
            <>
            <FloatingElement initialX="10%" initialY="20%" animationDelay="0s" className="opacity-30">
               <Image src="https://placehold.co/150x150/7c3aed/ffffff.png?text=MF1" alt="Abstract shape 1" width={150} height={150} className="rounded-full shadow-2xl" data-ai-hint="abstract tech" />
            </FloatingElement>
             <FloatingElement initialX="80%" initialY="10%" animationDelay="1s" className="opacity-20">
                <Image src="https://placehold.co/100x100/ec4899/ffffff.png?text=MF2" alt="Abstract shape 2" width={100} height={100} className="rounded-lg shadow-2xl" data-ai-hint="abstract data" />
            </FloatingElement>
             <FloatingElement initialX="5%" initialY="70%" animationDelay="2s" className="opacity-25">
                <Image src="https://placehold.co/120x120/22d3ee/ffffff.png?text=MF3" alt="Abstract shape 3" width={120} height={120} className="rounded-2xl shadow-2xl" data-ai-hint="abstract learning" />
            </FloatingElement>
            <FloatingElement initialX="85%" initialY="60%" animationDelay="0.5s" className="opacity-30">
               <Image src="https://placehold.co/180x180/f97316/ffffff.png?text=MF4" alt="Abstract shape 4" width={180} height={180} className="rounded-full shadow-2xl" data-ai-hint="abstract memory" />
            </FloatingElement>
            </>
          )}
          <ParallaxContainer speed={0.05}>
            <HeroSection />
          </ParallaxContainer>
        </div>
        <ParallaxContainer speed={0.02}>
          <FeaturesSection />
        </ParallaxContainer>
        <ParallaxContainer speed={0.01}>
         <CallToActionSection />
        </ParallaxContainer>
      </main>

      <footer className="py-12 bg-slate-900 text-center text-muted-foreground">
        <div className="container mx-auto">
          <AppLogo className="text-xl justify-center mb-4" />
          <p>&copy; {new Date().getFullYear()} MemoryForge. All rights reserved.</p>
          <p className="text-sm mt-2">Forge Your Knowledge, Master Your Mind.</p>
        </div>
      </footer>
    </div>
  );
}

// Helper function to combine class names (if not already available via clsx or similar)
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
