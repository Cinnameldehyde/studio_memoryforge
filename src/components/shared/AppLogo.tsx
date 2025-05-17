
import { BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import React from 'react';

interface AppLogoProps {
  className?: string;
}

export const AppLogo = React.memo(function AppLogo({ className }: AppLogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 text-lg sm:text-xl font-bold text-primary", // Default: text-lg, icon h-6 w-6. sm and up: text-xl, icon h-7 w-7
        className // Allows overriding or extending
      )}
      aria-label="MemoryForge Home"
    >
      <BrainCircuit className="h-6 sm:h-7 w-6 sm:w-7" />
      <span>MemoryForge</span>
    </Link>
  );
});
AppLogo.displayName = 'AppLogo';
