import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actionButton?: ReactNode;
}

export function PageHeader({ title, description, actionButton }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 rounded-xl border border-border/50 bg-card/70 p-6 shadow-lg backdrop-blur-md sm:flex-row sm:items-center">
      <div>
        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x"> 
          {title}
        </h1>
        {description && <p className="mt-2 text-base text-muted-foreground">{description}</p>}
      </div>
      {actionButton && <div className="mt-4 sm:mt-0">{actionButton}</div>}
    </div>
  );
}

// Add this to tailwind.config.ts animations if you want the gradient to shift
// keyframes: {
//   'gradient-x': {
//     '0%, 100%': { 'background-position': '0% 50%' },
//     '50%': { 'background-position': '100% 50%' },
//   },
// },
// animation: {
//  'gradient-x': 'gradient-x 3s ease infinite',
// },
// And ensure background-size is set, e.g., in globals.css for the .animate-gradient-x class:
// .animate-gradient-x { background-size: 200% 200%; }
// For simplicity, I'm not adding the animation part yet, just the static gradient.
