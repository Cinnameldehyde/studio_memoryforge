import { BrainCircuit } from 'lucide-react';
import Link from 'next/link';

export function AppLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 text-xl font-bold text-primary ${className || ''}`} aria-label="MemoryForge Home">
      <BrainCircuit className="h-7 w-7" />
      <span>MemoryForge</span>
    </Link>
  );
}
