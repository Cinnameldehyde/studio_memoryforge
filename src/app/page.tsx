
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
import { cn } from '@/lib/utils';

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


// Floating element
const FloatingElement = ({ className, children, initialX, initialY, animationDelay, rotationX = 0, rotationY = 0, rotationZ = 0 }: { className?: string, children: React.ReactNode, initialX?: string, initialY?: string, animationDelay?: string, rotationX?: number, rotationY?: number, rotationZ?: number }) => {
  return (
    <div
      className={cn("absolute animate-float hover:animate-float-plus-hover transition-all duration-300", className)}
      style={{
        left: initialX,
        top: initialY,
        animationDelay: animationDelay,
        transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg) rotateZ(${rotationZ}deg)`,
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
    <div className="min-h-screen bg-gradient-to-b from-background via-slate-900/90 to-slate-900 text-foreground flex flex-col overflow-x-hidden">
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

      <main className="flex-grow">
        {/* Container for floating elements, with perspective and z-index to allow overlap */}
        <div className="relative perspective" style={{ zIndex: 10 }}> 
          {isClient && ( 
            <>
            <FloatingElement initialX="10%" initialY="20%" animationDelay="0s" rotationY={15} rotationX={-5} className="opacity-70">
               <Image src="https://placehold.co/200x280/6d28d9/ffffff.png?text=Q:\nWhat+is+AI?" alt="Example Flashcard 1" width={150} height={210} className="rounded-lg shadow-2xl" data-ai-hint="flashcard design" />
            </FloatingElement>
             <FloatingElement initialX="80%" initialY="10%" animationDelay="1s" rotationY={-20} rotationX={10} className="opacity-60">
                <Image src="https://placehold.co/180x250/db2777/ffffff.png?text=A:\nMagic!" alt="Example Flashcard 2" width={120} height={175} className="rounded-md shadow-2xl" data-ai-hint="study interface" />
            </FloatingElement>
             <FloatingElement initialX="5%" initialY="70%" animationDelay="2s" rotationY={10} rotationX={5} className="opacity-65">
                <Image src="https://placehold.co/220x300/16a34a/ffffff.png?text=Learn\nAnything" alt="Example Flashcard 3" width={160} height={220} className="rounded-xl shadow-2xl" data-ai-hint="learning tool" />
            </FloatingElement>
            <FloatingElement initialX="85%" initialY="60%" animationDelay="0.5s" rotationY={-10} rotationX={-8} className="opacity-70">
               <Image src="https://placehold.co/200x280/f59e0b/ffffff.png?text=Memory\nBoost" alt="Example Flashcard 4" width={150} height={210} className="rounded-lg shadow-2xl" data-ai-hint="knowledge retention" />
            </FloatingElement>
            </>
          )}
          {/* Main content sections, z-index needs to be lower if floating elements are to overlap */}
          <div className="relative" style={{ zIndex: 1 }}>
            <ParallaxContainer speed={0.05}>
              <HeroSection />
            </ParallaxContainer>
          </div>
        </div>
        <div className="relative" style={{ zIndex: 1 }}> {/* Ensure other sections also respect z-index for overlap */}
          <ParallaxContainer speed={0.02}>
            <FeaturesSection />
          </ParallaxContainer>
          <ParallaxContainer speed={0.01}>
           <CallToActionSection />
          </ParallaxContainer>
        </div>
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
