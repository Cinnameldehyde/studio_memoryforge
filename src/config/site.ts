
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Layers, Edit3, Sparkles } from 'lucide-react';

export const APP_NAME = "MemoryForge";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  disabled?: boolean;
}

export const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Overview",
  },
  {
    title: "Review Cards",
    href: "/review",
    icon: Layers,
    label: "Study",
  },
  {
    title: "Manage Cards",
    href: "/manage",
    icon: Edit3,
    label: "Create & Edit",
  },
  {
    title: "AI Generate",
    href: "/generate-ai",
    icon: Sparkles,
    label: "From Document",
  }
];
