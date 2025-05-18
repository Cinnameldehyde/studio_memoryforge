
import { BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

interface AppLogoProps {
  className?: string;
  // Adding an optional href prop to allow parent to decide if it's a link and where it goes
  // However, for this fix, we'll make it purely presentational and wrap externally.
}

export const AppLogo = React.memo(function AppLogo({ className }: AppLogoProps) {
  return (
    // Changed from Link to div. It could also be a span or React.Fragment if no wrapper div is desired.
    // The parent component will now be responsible for wrapping this with a Link if it needs to be clickable.
    <div
      className={cn(
        "flex items-center gap-2 text-lg sm:text-xl font-bold text-primary", // Default: text-lg, icon h-6 w-6. sm and up: text-xl, icon h-7 w-7
        className // Allows overriding or extending
      )}
    >
      <BrainCircuit className="h-6 sm:h-7 w-6 sm:w-7 current-color" />
      <span className="current-color">MemoryForge</span>
    </div>
  );
});
AppLogo.displayName = 'AppLogo';
