"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNavItems, type NavItem } from "@/config/site";
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface SidebarNavProps {
  items: NavItem[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <SidebarMenu>
      {items.map((item, index) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        
        return item.href ? (
          <SidebarMenuItem key={index}>
            <Link href={item.href} legacyBehavior passHref>
              <SidebarMenuButton
                variant="default"
                size="default"
                isActive={isActive}
                disabled={item.disabled}
                className={cn(
                  "justify-start",
                  isActive && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90",
                  !isActive && "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                tooltip={item.title}
              >
                <Icon className="mr-2 h-5 w-5" />
                <span className="truncate">{item.title}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ) : null;
      })}
    </SidebarMenu>
  );
}
