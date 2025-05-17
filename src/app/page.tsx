
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
  const [activeSectionTab, setActiveSectionTab] = useState<string | null>(navItems[0].name); // Default to 'Home'

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
      const scrollPosition = window.scrollY;
      const offset = window.innerHeight * 0.4; // Consider section active when it's 40% from top

      let currentActiveTab = null;

      for (const item of navItems) {
        const section = sectionRefs[item.name]?.current;
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          // Check if the top of the section is within the viewport (with offset)
          // And also if the bottom of the section is still somewhat in view
          if (scrollPosition + offset >= sectionTop && scrollPosition + offset < sectionTop + sectionHeight) {
            currentActiveTab = item.name;
            break; 
          }
        }
      }
      
      // Fallback to the first item if no section is prominently in view (e.g., at the very top or bottom)
      if (!currentActiveTab && navItems.length > 0) {
        if (scrollPosition < (sectionRefs[navItems[0].name]?.current?.offsetTop || 0) + (sectionRefs[navItems[0].name]?.current?.offsetHeight || 0) / 2) {
            currentActiveTab = navItems[0].name;
        } else if (scrollPosition + window.innerHeight >= document.documentElement.scrollHeight - 50) { // Near bottom
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

      <header className="fixed top-4 inset-x-0 mx-auto w-full max-w-3xl z-50 bg-neutral-800/40 backdrop-blur-md shadow-lg rounded-xl">
        <div className="flex justify-between items-center px-4 sm:px-6 py-3">
          <AppLogo className="text-lg sm:text-xl !text-white text-shadow-sm" />
          <nav
            className="hidden md:flex space-x-1 items-center relative" // Hidden on small screens, flex on md+
            onMouseLeave={() => setHoveredTab(null)}
          >
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} legacyBehavior passHref>
                <motion.a
                  className="relative px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-white text-shadow-sm rounded-md"
                  onHoverStart={() => setHoveredTab(item.name)}
                  onClick={(e) => {
                     setHoveredTab(item.name); // Set hovered for immediate pill move on click
                     setActiveSectionTab(item.name); // Also set active section on click
                     const element = document.querySelector(item.href);
                     if (element) {
                       e.preventDefault(); // Prevent default anchor jump
                       element.scrollIntoView({ behavior: 'smooth' });
                     }
                  }}
                  href={item.href} 
                >
                  {displayTab === item.name && (
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
          <div className="flex items-center"> {/* Wrapper for the button to ensure correct flex behavior */}
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : user ? (
              <Button asChild variant="default" size="sm" className="bg-primary hover:bg-primary-gradient text-primary-foreground">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="default" size="sm" className="bg-primary hover:bg-primary-gradient text-primary-foreground">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
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
        </div>
      </footer>
    </div>
  );
}

    