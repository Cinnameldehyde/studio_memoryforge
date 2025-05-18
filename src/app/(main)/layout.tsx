
"use client";

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { AppLogo } from '@/components/shared/AppLogo';
import { UserNav } from '@/components/layout/UserNav';
import { SidebarNav } from '@/components/layout/SidebarNav';
import { mainNavItems, APP_NAME } from '@/config/site';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { Loader2, PanelLeft } from 'lucide-react';

function MainContent({ children }: { children: ReactNode }) {
  const { isMobile, toggleSidebar, open } = useSidebar();

  const handleToggle = () => {
    toggleSidebar();
  };

  return (
    <div className="flex min-h-svh flex-1 flex-col"> {/* Ensures footer can be pushed down */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4">
        {/* Sidebar Trigger for both mobile and desktop */}
        <SidebarTrigger asChild>
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted" onClick={handleToggle} title={open && !isMobile ? "Collapse sidebar" : "Expand sidebar"}>
            <PanelLeft />
            <span className="sr-only">Toggle Menu</span>
            </Button>
        </SidebarTrigger>
        
        <div className="flex items-center gap-4 ml-auto"> {/* Pushes UserNav to the right */}
          <UserNav />
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        {children}
      </main>
      <footer className="border-t border-border/50 py-3 text-center text-xs bg-background/80 text-white/80 text-shadow-sm">
        <div className="container mx-auto flex flex-col sm:flex-row justify-center items-center space-y-1 sm:space-y-0 sm:space-x-3">
          <span>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</span>
          <span className="hidden sm:inline opacity-50">|</span>
          <Link href="#" className="hover:underline text-white/90 hover:text-white">Privacy Policy</Link>
          <span className="hidden sm:inline opacity-50">|</span>
          <Link href="#" className="hover:underline text-white/90 hover:text-white">Terms & Conditions</Link>
          <span className="hidden sm:inline opacity-50">|</span>
          <Link href="#" className="hover:underline text-white/90 hover:text-white">Contact Us</Link>
        </div>
      </footer>
    </div>
  );
}

export default function MainAppLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="fixed inset-0 z-[-1] bg-landing-gradient animate-gradient-x flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
      </div>
    );
  }
  
  return (
    <div className="relative min-h-svh w-full">
      <div
        className="fixed inset-0 z-[-1] bg-landing-gradient animate-gradient-x"
        aria-hidden="true"
      />
      <SidebarProvider defaultOpen={true}>
        <Sidebar 
          collapsible="icon" 
          variant="sidebar" 
          side="left" 
          className="bg-sidebar border-r"
        >
          {/* SidebarHeader removed */}
          <SidebarContent>
            <SidebarNav items={mainNavItems} />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <MainContent>{children}</MainContent>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
