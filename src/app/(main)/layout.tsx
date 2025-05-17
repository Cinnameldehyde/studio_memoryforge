
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
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { Loader2, PanelLeft, Pin, PinOff } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { cn } from '@/lib/utils';

function MainContent({ children, isPinned }: { children: ReactNode, isPinned: boolean }) {
  const { isMobile, toggleSidebar, open } = useSidebar();

  const handleToggle = () => {
    if (isPinned && !isMobile && open) {
      // If pinned and open on desktop, trigger does nothing or could show a "pinned" message
      // For now, let's allow it to close, pinning will reopen it via useEffect.
      // Or, to strictly prevent closing when pinned:
      // console.log("Sidebar is pinned.");
      // return;
    }
    toggleSidebar();
  };

  return (
    <div className="flex flex-1 flex-col"> {/* Ensures footer can be pushed down */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur-md md:justify-end">
        {isMobile && (
          <SidebarTrigger asChild>
             <Button variant="ghost" size="icon" className="md:hidden text-foreground hover:bg-muted" onClick={handleToggle}>
              <PanelLeft />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SidebarTrigger>
        )}
         {!isMobile && ( // Desktop: Show trigger only if not pinned or if pinned and currently closed (which useEffect will fix)
            <SidebarTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted" onClick={handleToggle} title={open ? "Collapse sidebar" : "Expand sidebar"}>
                <PanelLeft />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SidebarTrigger>
         )}
        <div className="flex items-center gap-4">
          <UserNav />
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        {children}
      </main>
      <footer className="border-t border-border/50 py-3 text-center text-xs text-muted-foreground">
        <div className="container mx-auto flex flex-col sm:flex-row justify-center items-center space-y-1 sm:space-y-0 sm:space-x-3">
          <span>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</span>
          <span className="hidden sm:inline opacity-50">|</span>
          <Link href="#" className="hover:underline">Privacy Policy</Link>
          <span className="hidden sm:inline opacity-50">|</span>
          <Link href="#" className="hover:underline">Terms & Conditions</Link>
          <span className="hidden sm:inline opacity-50">|</span>
          <Link href="#" className="hover:underline">Contact Us</Link>
        </div>
      </footer>
    </div>
  );
}

function SidebarLayoutContent({ isPinned, setIsPinned }: { isPinned: boolean, setIsPinned: (value: boolean | ((prev: boolean) => boolean)) => void }) {
  const { open, setOpen, isMobile, state: sidebarState } = useSidebar();

  useEffect(() => {
    if (isPinned && !isMobile && !open) {
      setOpen(true);
    }
  }, [isPinned, isMobile, open, setOpen]);

  return (
    <>
      <SidebarHeader className="border-b border-border/50">
        <div className="flex items-center justify-between p-3">
           <AppLogo className="text-primary" />
           <div className="md:hidden"> 
              <SidebarTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
                  <PanelLeft />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SidebarTrigger>
            </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav items={mainNavItems} />
      </SidebarContent>
      {!isMobile && (
        <SidebarFooter className="p-2 border-t border-border/50">
           <Button
            variant="ghost"
            className={cn(
                "w-full justify-start items-center p-2 h-auto text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                sidebarState === 'collapsed' && "justify-center" // Center icon when sidebar is icon-only
            )}
            onClick={() => setIsPinned(p => !p)}
            title={isPinned ? "Unpin sidebar (allow collapse)" : "Pin sidebar (keep open)"}
          >
            {isPinned ? <PinOff className={cn("h-5 w-5 flex-shrink-0", sidebarState === 'expanded' && "mr-2")} /> : <Pin className={cn("h-5 w-5 flex-shrink-0", sidebarState === 'expanded' && "mr-2")} />}
            {sidebarState === 'expanded' && (
              <span className="truncate">
                {isPinned ? "Unpin Sidebar" : "Pin Sidebar"}
              </span>
            )}
          </Button>
        </SidebarFooter>
      )}
    </>
  );
}


export default function MainAppLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isPinned, setIsPinned] = useLocalStorage<boolean>('sidebar-pinned', true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-transparent">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // Determine collapsible prop based on isPinned and if we are on mobile (where it's always a sheet)
  // The Sidebar component itself handles the mobile sheet behavior.
  // For desktop, if pinned, it's "none"; if not pinned, it's "icon".
  const desktopCollapsibleMode = isPinned ? "none" : "icon";

  return (
    <SidebarProvider defaultOpen={true}> {/* defaultOpen helps initialize, pinning might override */}
      <Sidebar 
        collapsible={desktopCollapsibleMode} // Controls desktop behavior
        variant="sidebar" 
        side="left" 
        className="border-r border-border/50 bg-sidebar/80 backdrop-blur-sm"
      >
        <SidebarLayoutContent isPinned={isPinned} setIsPinned={setIsPinned} />
      </Sidebar>
      <SidebarInset>
        <MainContent isPinned={isPinned}>{children}</MainContent>
      </SidebarInset>
    </SidebarProvider>
  );
}

