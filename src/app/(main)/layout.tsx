
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
} from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { Loader2, PanelLeft } from 'lucide-react';

// Layer 2: Screen Header
function FullScreenHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 shadow-sm sm:px-6">
      <div className="flex items-center">
        <SidebarTrigger asChild>
          <Button variant="ghost" size="icon" className="text-foreground hover:bg-primary/20 hover:text-primary">
            <PanelLeft />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SidebarTrigger>
      </div>
      <div className="flex-1 flex justify-center">
        <Link href="/dashboard" passHref aria-label={`${APP_NAME} Dashboard`}>
            <AppLogo className="text-xl" />
        </Link>
      </div>
      <div className="flex items-center">
        {<UserNav />}
      </div>
    </header>
  );
}

// Layer 3: Sidebar Component
function AppSidebar() {
  return (
    <Sidebar 
      collapsible="icon" 
      variant="sidebar" 
      side="left" 
      className="z-50 bg-sidebar border-r" // Restored border-r for visual separation
    >
      <SidebarContent className="mt-16 pt-2"> 
        <SidebarNav items={mainNavItems} />
      </SidebarContent>
    </Sidebar>
  );
}

// Layer 1: Main Application Content Area
function AppContentArea({ children }: { children: ReactNode }) {
  return (
    <SidebarInset className="bg-landing-gradient animate-gradient-x">
      <div className="flex min-h-svh flex-1 flex-col"> 
        <main className="flex-1 overflow-y-auto p-4 pt-24 md:p-6 md:pt-24 lg:p-8 lg:pt-28"> 
          {children}
        </main>
        <footer className="border-t border-border/50 py-3 text-center text-xs bg-transparent text-white/80 text-shadow-sm">
          <div className="container mx-auto flex flex-col sm:flex-row justify-center items-center space-y-1 sm:space-y-0 sm:gap-x-3">
            <span>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</span>
            <div className="flex flex-wrap justify-center items-center gap-x-1.5 sm:gap-x-3">
              <span className="hidden sm:inline opacity-50">|</span>
              <Link href="#" className="hover:underline text-white/90 hover:text-white">Privacy Policy</Link>
              <span className="opacity-50 mx-0.5 sm:mx-0">|</span>
              <Link href="#" className="hover:underline text-white/90 hover:text-white">Terms & Conditions</Link>
              <span className="opacity-50 mx-0.5 sm:mx-0">|</span>
              <Link href="#" className="hover:underline text-white/90 hover:text-white">Contact Us</Link>
            </div>
          </div>
        </footer>
      </div>
    </SidebarInset>
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

  // Programmatic prefetching of main navigation routes
  useEffect(() => {
    if (user && !isLoading) { // Only prefetch if the user is logged in and auth is not loading
      mainNavItems.forEach(item => {
        if (item.href && typeof item.href === 'string') {
          router.prefetch(item.href);
        }
      });
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
      <SidebarProvider defaultOpen={true}>
        <FullScreenHeader />
        <AppSidebar />
        <AppContentArea>{children}</AppContentArea>
      </SidebarProvider>
    </div>
  );
}
