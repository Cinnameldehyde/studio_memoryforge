
"use client";

import { useEffect, useState, useRef } from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { CallToActionSection } from '@/components/landing/CallToActionSection';
import { AppLogo } from '@/components/shared/AppLogo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'Home', href: '#hero' },
  { name: 'Features', href: '#features' },
  { name: 'Start Now', href: '#cta' },
];

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [activeSectionTab, setActiveSectionTab] = useState<string | null>(navItems[0].name);

  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const sectionRefs = {
    'Home': heroRef,
    'Features': featuresRef,
    'Start Now': ctaRef,
  };
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!isClient) return;

      const scrollPosition = window.scrollY;
      const offset = window.innerHeight * 0.4; 

      let currentActiveTab = null;

      for (const item of navItems) {
        const section = sectionRefs[item.name]?.current;
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          
          if (scrollPosition + offset >= sectionTop && scrollPosition + offset < sectionTop + sectionHeight) {
            currentActiveTab = item.name;
            break; 
          }
        }
      }
      
      if (!currentActiveTab && navItems.length > 0 && heroRef.current) {
         if (scrollPosition < heroRef.current.offsetTop + heroRef.current.offsetHeight / 2) {
             currentActiveTab = navItems[0].name;
         } else if (ctaRef.current && scrollPosition + window.innerHeight >= ctaRef.current.offsetTop + ctaRef.current.offsetHeight / 2) {
             currentActiveTab = navItems[navItems.length -1].name;
         }
      }
      
      if (currentActiveTab) {
        setActiveSectionTab(currentActiveTab);
      }
    };

    if (isClient) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Initial check
    }

    return () => {
      if (isClient) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isClient, sectionRefs]);


  if (isLoading && !isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const displayTab = hoveredTab ?? activeSectionTab;

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden text-foreground">
      <div
        className="fixed inset-0 z-[-1] bg-landing-gradient animate-gradient-x"
        aria-hidden="true"
      />

      <header className="fixed top-4 left-4 right-4 md:inset-x-0 md:mx-auto md:w-full md:max-w-screen-md z-50 bg-neutral-800/40 backdrop-blur-md shadow-lg rounded-xl">
        <div className="flex items-center justify-center md:justify-between px-4 sm:px-6 py-3">
          <AppLogo className="text-lg sm:text-xl !text-white text-shadow-sm" />
          
          <nav
            className="hidden md:flex space-x-1 items-center relative md:mx-6" 
            onMouseLeave={() => setHoveredTab(null)}
          >
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} legacyBehavior passHref>
                <motion.a
                  className="relative px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-white text-shadow-sm rounded-md"
                  onHoverStart={() => setHoveredTab(item.name)}
                  onClick={(e) => {
                     setHoveredTab(item.name); 
                     setActiveSectionTab(item.name);
                     const element = document.querySelector(item.href);
                     if (element) {
                       e.preventDefault();
                       element.scrollIntoView({ behavior: 'smooth' });
                     }
                  }}
                  href={item.href}
                >
                  {(displayTab === item.name) && (
                    <motion.div
                      className="absolute inset-0 bg-white/10 rounded-full z-0"
                      layoutId="active-nav-pill"
                      transition={{ type: "spring", bounce: 0.1, duration: 0.3 }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </motion.a>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : user ? (
              <Button asChild variant="default" size="sm" className="bg-primary hover:bg-primary-gradient text-primary-foreground">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button asChild variant="default" size="sm" className="bg-primary hover:bg-primary-gradient text-primary-foreground">
                <Link href="/signup">Get Started</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow relative z-0">
        <HeroSection id="hero" ref={heroRef} />
        <FeaturesSection id="features" ref={featuresRef} />
        <CallToActionSection id="cta" ref={ctaRef}/>
      </main>

      <footer className="
        py-12 text-center relative z-0
        before:content-['']
        before:absolute before:inset-x-0 before:bottom-0 before:h-full
        before:bg-gradient-to-t before:from-black/70 before:to-transparent
        before:z-[-1] before:pointer-events-none
      ">
        <div className="container mx-auto relative">
          <AppLogo className="text-xl !text-white text-shadow-sm justify-center mb-4" />
          <p className="text-sm text-white/90 text-shadow-sm">&copy; {new Date().getFullYear()} MemoryForge. All rights reserved.</p>
          <p className="text-xs mt-2 text-white/80 text-shadow-sm">Forge Your Knowledge, Master Your Mind.</p>
          <div className="mt-4 flex justify-center items-center space-x-3 sm:space-x-4 text-xs text-white/80 text-shadow-sm">
            <Link href="#" className="hover:underline">Privacy Policy</Link>
            <span className="opacity-50">|</span>
            <Link href="#" className="hover:underline">Terms & Conditions</Link>
            <span className="opacity-50">|</span>
            <Link href="#" className="hover:underline">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

