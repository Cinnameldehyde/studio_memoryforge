
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function UserNav() {
  const { user, logout } = useAuth();

  if (!user) {
    return null; // Or a login button if preferred in this position
  }

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
  };

  const avatarText = getInitials(user.name);
  // Use a more consistent placeholder service or one that allows color customization if needed
  const placeholderAvatarUrl = `https://placehold.co/40x40/7c3aed/ffffff.png?text=${avatarText}`;


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatarUrl || placeholderAvatarUrl} alt={user.name || "User"} data-ai-hint="user avatar" />
            <AvatarFallback>{avatarText}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
            {user.email && (
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={logout} 
          className={cn(
            // Base styles
            "text-destructive",       // Make text red by default
            "!bg-transparent",        // Ensure no default background
            "cursor-pointer",

            // Hover states
            "hover:!bg-destructive/5",  // On hover, 5% opacity red background
            "hover:!text-destructive",  // On hover, text stays red

            // Focus states (often triggered by hover too)
            "focus:!bg-destructive/5",  // On focus, 5% opacity red background
            "focus:!text-destructive"   // On focus, text stays red
          )}
        >
          <LogOut className="mr-2 h-4 w-4" /> 
          {/* Icon color is inherited from parent's text-destructive */}
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
