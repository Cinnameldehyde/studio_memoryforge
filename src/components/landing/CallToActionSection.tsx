
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import React from 'react';

interface CallToActionSectionProps {
  id: string;
}

export const CallToActionSection = React.forwardRef<HTMLDivElement, CallToActionSectionProps>(({ id }, ref) => {
  return (
    <section id={id} ref={ref} className="relative py-12 md:py-16 overflow-hidden bg-transparent">
      <div className="container mx-auto px-4 text-center z-10 relative">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-white text-shadow-md mb-6"
        >
          Ready to Forge Your Memory?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-lg md:text-xl text-white text-shadow-sm mb-10 max-w-xl mx-auto"
        >
          Join thousands of learners who are transforming their study habits. Sign up today and start mastering new subjects with ease.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <Button asChild size="lg" className="px-12 py-7 text-xl bg-primary hover:bg-primary-gradient text-primary-foreground rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <Link href="/signup">Get Started for Free</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
});
CallToActionSection.displayName = 'CallToActionSection';

    