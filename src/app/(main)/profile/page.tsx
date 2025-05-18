
"use client";

import { PageHeader } from '@/components/shared/PageHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { Edit, Mail, User, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    // This should ideally not happen if the layout protects the route
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <p>Loading user profile...</p>
      </div>
    );
  }

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
  };
  
  const avatarText = getInitials(user.name);
  const placeholderAvatarUrl = `https://placehold.co/128x128/7c3aed/ffffff.png?text=${avatarText}`;


  return (
    <div className="space-y-8">
      <PageHeader
        title="Your Profile"
        description="View and manage your account details."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <Card className="md:col-span-1 shadow-xl">
          <CardHeader className="items-center text-center">
            <Avatar className="h-32 w-32 mb-4 border-4 border-primary/50 shadow-lg">
              <AvatarImage src={user.avatarUrl || placeholderAvatarUrl} alt={user.name || "User avatar"} data-ai-hint="user avatar large" />
              <AvatarFallback className="text-4xl">{avatarText}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{user.name || "User"}</CardTitle>
            {user.email && <CardDescription className="text-base">{user.email}</CardDescription>}
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              <Edit className="mr-2 h-4 w-4" /> Edit Profile (Placeholder)
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-xl">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Basic details associated with your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <User className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{user.name || "Not set"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Mail className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="font-medium">{user.email || "Not set"}</p>
              </div>
            </div>
             <div className="flex items-center space-x-4">
              <ShieldCheck className="h-6 w-6 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Account Status</p>
                <p className="font-medium text-green-600">Verified</p>
              </div>
            </div>
            {/* Placeholder for more settings */}
             <div className="pt-4">
                <Button variant="destructive" className="w-full sm:w-auto">Delete Account (Placeholder)</Button>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
