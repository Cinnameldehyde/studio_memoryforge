
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
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Home', href: '#hero' },
  { name: 'Features', href: '#features' },
  { name: 'Start Now', href: '#cta' },
];

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

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
      <div
        className="fixed inset-0 z-[-1] bg-landing-gradient animate-gradient-x"
        aria-hidden="true"
      />

      <header className="sticky top-0 z-50 py-4 px-4 sm:px-8 bg-background/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <AppLogo className="text-2xl" />
          <nav className="hidden md:flex space-x-1 items-center">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} legacyBehavior passHref>
                <motion.a
                  className="relative px-3 py-2 text-sm font-medium text-white text-shadow-sm rounded-md hover:bg-white/10 transition-colors"
                  onHoverStart={() => setHoveredTab(item.name)}
                  onHoverEnd={() => setHoveredTab(null)}
                >
                  {item.name}
                  {hoveredTab === item.name && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      layoutId="underline"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.a>
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : user ? (
              <Button asChild variant="default" size="sm" className="bg-primary hover:bg-primary-gradient text-primary-foreground">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="hover:text-primary text-white text-shadow-sm hover:bg-white/10">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild variant="default" size="sm" className="bg-primary hover:bg-primary-gradient text-primary-foreground">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow relative z-0">
        <HeroSection id="hero" />
        <FeaturesSection id="features" />
        <CallToActionSection id="cta" />
      </main>

      <footer className="
        py-12 text-center relative z-0
        before:content-['']
        before:absolute before:inset-x-0 before:bottom-0 before:h-full
        before:bg-gradient-to-t before:from-black/70 before:to-transparent
        before:z-[-1] before:pointer-events-none
      ">
        <div className="container mx-auto relative">
          <AppLogo className="text-xl justify-center mb-4 text-white text-shadow" />
          <p className="text-white text-shadow-sm">&copy; {new Date().getFullYear()} MemoryForge. All rights reserved.</p>
          <p className="text-sm mt-2 text-white text-shadow-sm">Forge Your Knowledge, Master Your Mind.</p>
        </div>
      </footer>
    </div>
  );
}
