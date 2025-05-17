"use client";

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { AppLogo } from '@/components/shared/AppLogo';
import { UserNav } from '@/components/layout/UserNav';
import { SidebarNav } from '@/components/layout/SidebarNav';
import { mainNavItems } from '@/config/site';
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
import { Loader2, PanelLeft } from 'lucide-react';

function MainContent({ children }: { children: ReactNode }) {
  const { isMobile } = useSidebar(); // Get isMobile from useSidebar
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur md:justify-end">
        {isMobile && ( // Only show SidebarTrigger on mobile
          <SidebarTrigger asChild>
             <Button variant="ghost" size="icon" className="md:hidden">
              <PanelLeft />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SidebarTrigger>
        )}
         {!isMobile && <div className="md:hidden" />} {/* Placeholder to balance flex on mobile */}
        <div className="flex items-center gap-4">
          <UserNav />
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        {children}
      </main>
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
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <SidebarHeader className="border-b">
          <div className="flex items-center justify-between p-2">
             <AppLogo />
             <div className="md:hidden"> {/* Hidden on md and up */}
                <SidebarTrigger asChild>
                  <Button variant="ghost" size="icon">
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
        {/* <SidebarFooter>
          Footer content if any
        </SidebarFooter> */}
      </Sidebar>
      <SidebarInset>
        <MainContent>{children}</MainContent>
      </SidebarInset>
    </SidebarProvider>
  );
}
