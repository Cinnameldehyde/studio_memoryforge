
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
  SidebarHeader, // Added back if needed, or ensure AppLogo is styled correctly
} from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { Loader2, PanelLeft } from 'lucide-react';

// Layer 2: Screen Header
function FullScreenHeader() {
  const { user } = useAuth(); 

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b border-border/20 bg-background/50 px-4 shadow-sm backdrop-blur-md sm:px-6">
      <div className="flex items-center">
        <SidebarTrigger asChild>
          <Button variant="ghost" size="icon" className="text-foreground hover:bg-primary/20 hover:text-primary">
            <PanelLeft />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SidebarTrigger>
      </div>
      <div className="flex-1 flex justify-center">
        {/* Ensure AppLogo is clickable and correctly styled */}
        <Link href="/dashboard" passHref aria-label={`${APP_NAME} Dashboard`}>
            <AppLogo className="text-xl" />
        </Link>
      </div>
      <div className="flex items-center">
        {user && <UserNav />}
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
      className="z-50 border-r-0 bg-sidebar/80 backdrop-blur-md" // Ensure higher z-index than header, border-r-0 if seamless desired
    >
      {/* AppLogo was previously removed from here, it's now in FullScreenHeader */}
      <SidebarContent className="mt-16 pt-2"> {/* Add margin-top to account for FullScreenHeader height */}
        <SidebarNav items={mainNavItems} />
      </SidebarContent>
    </Sidebar>
  );
}

// Layer 1: Main Application Content Area
function AppContentArea({ children }: { children: ReactNode }) {
  return (
    <SidebarInset className="bg-landing-gradient animate-gradient-x">
      <div className="flex min-h-svh flex-1 flex-col"> {/* Ensures footer can be pushed down */}
        <main className="flex-1 overflow-y-auto p-4 pt-24 md:p-6 md:pt-24 lg:p-8 lg:pt-28"> {/* Increased padding-top for FullScreenHeader */}
          {children}
        </main>
        <footer className="border-t border-border/50 py-3 text-center text-xs bg-transparent text-white/80 text-shadow-sm">
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
