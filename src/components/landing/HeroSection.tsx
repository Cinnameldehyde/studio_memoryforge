
"use client";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative py-12 md:py-20 min-h-[70vh] flex items-center justify-center text-center overflow-hidden bg-transparent">
      
      <div className="container mx-auto px-4 z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-6 pb-2 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary-foreground animate-gradient-x"
        >
          Unlock Your Potential with MemoryForge
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-lg md:text-xl text-white text-shadow-md mb-10 max-w-3xl mx-auto"
        >
          Harness the power of AI-driven spaced repetition to learn faster, remember longer, and achieve your goals.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button asChild size="lg" className="px-10 py-6 text-lg bg-primary hover:bg-primary-gradient text-primary-foreground rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <Link href="/signup">Start Forging - It&apos;s Free!</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
