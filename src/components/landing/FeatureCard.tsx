
import type { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, amount: 0.3 }}
      className="h-full"
    >
      <Card className={cn(
        "h-full border-border/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col",
        "bg-gradient-to-tr from-[hsl(var(--card))]/70 via-[hsl(var(--card))]/50 to-[hsl(var(--card))]/30", // Gradient with transparency
        "dark:from-[hsl(var(--card))]/70 dark:via-[hsl(var(--card))]/50 dark:to-[hsl(var(--card))]/30", // Ensure dark mode also gets it
        "backdrop-blur-md" // Enhanced blur
      )}>
        <CardHeader className="items-center text-center">
          <div className="p-4 bg-primary/10 rounded-full mb-4 inline-block ring-2 ring-primary/20">
            <Icon className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-semibold text-card-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center flex-grow">
          <CardDescription className="text-muted-foreground text-base">{description}</CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
}
