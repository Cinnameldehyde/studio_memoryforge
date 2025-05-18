
"use client";

import React, { useState, useEffect } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '@/components/shared/PageHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Edit, Mail, User, ShieldCheck, Save, XCircle, Loader2 } from 'lucide-react';

const profileEditSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(50, "Name is too long."),
  avatarFile: z.instanceof(FileList).optional()
    .refine(files => !files || files.length === 0 || (files[0] && files[0].size <= 2 * 1024 * 1024), {
      message: "Avatar image must be less than 2MB.",
    })
    .refine(files => !files || files.length === 0 || (files[0] && ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(files[0].type)), {
      message: "Only .jpg, .png, .webp, .gif formats are supported.",
    }),
});

type ProfileEditFormValues = z.infer<typeof profileEditSchema>;

const getInitials = (name?: string) => {
  if (!name) return 'U';
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
};

const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};


export default function ProfilePage() {
  const { user, updateUserProfile, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null); // Used for previewing new avatar

  const form = useForm<ProfileEditFormValues>({
    resolver: zodResolver(profileEditSchema),
  });

  // Effect to reset form and avatar preview when user data changes or when toggling edit mode
  useEffect(() => {
    if (user) {
      form.reset({ name: user.name || "" }); // Reset form fields with current user's name
      setAvatarPreview(user.avatarUrl || null); // Set preview to current user's avatar
    }
  }, [user, form, isEditing]); // Depend on user and isEditing state


  const onSubmit: SubmitHandler<ProfileEditFormValues> = async (data) => {
    if (!user) return;

    let newAvatarDataUrl: string | undefined = undefined;
    if (data.avatarFile && data.avatarFile.length > 0) {
      try {
        newAvatarDataUrl = await readFileAsDataURL(data.avatarFile[0]);
      } catch (error) {
        console.error("Error reading avatar file:", error);
        toast({ title: "Image Upload Error", description: "Could not process the avatar image. Please try another file.", variant: "destructive" });
        return;
      }
    }

    await updateUserProfile({
      name: data.name,
      avatarUrl: newAvatarDataUrl, // This will be undefined if no new file was selected
    });
    setIsEditing(false); // Switch back to view mode after saving
  };

  if (authLoading && !user) {
     return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    // This should ideally not happen if the layout protects the route
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <p>User not found or not logged in. Please log in to view your profile.</p>
      </div>
    );
  }


  const currentAvatarText = getInitials(user?.name);
  // Use avatarPreview if available (newly selected file), otherwise user.avatarUrl, else placeholder
  const displayAvatarSrc = avatarPreview || user?.avatarUrl || `https://placehold.co/128x128/7c3aed/ffffff.png?text=${currentAvatarText}`;


  return (
    <div className="space-y-8">
      <PageHeader
        title="Your Profile"
        description={isEditing ? "Update your account details." : "View and manage your account details."}
      />

      {isEditing ? (
        <Card className="shadow-xl max-w-2xl mx-auto">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className="items-center">
              <CardTitle className="text-2xl">Edit Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32 mb-2 border-4 border-primary/50 shadow-lg">
                  <AvatarImage src={displayAvatarSrc} alt={user.name || "User avatar"} data-ai-hint="user avatar large preview" />
                  <AvatarFallback className="text-4xl">{currentAvatarText}</AvatarFallback>
                </Avatar>
                <div>
                  <Label htmlFor="avatarFile" className="text-sm font-medium text-muted-foreground">Change Profile Picture</Label>
                  <Controller
                    name="avatarFile"
                    control={form.control}
                    render={({ field: { onChange, ...restField } }) => (
                      <Input
                        id="avatarFile"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="mt-1 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        onChange={(e) => {
                          const files = e.target.files;
                          onChange(files); // Update react-hook-form state
                          if (files && files[0]) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setAvatarPreview(reader.result as string);
                            };
                            reader.readAsDataURL(files[0]);
                          } else {
                             // If file selection is cancelled, revert to current user's avatar
                            setAvatarPreview(user.avatarUrl || null);
                          }
                        }}
                        {...restField}
                      />
                    )}
                  />
                   {form.formState.errors.avatarFile && (
                    <p className="mt-1 text-xs text-destructive">{form.formState.errors.avatarFile.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="name" className="text-base">Full Name</Label>
                <Input
                  id="name"
                  className="mt-1"
                  {...form.register('name')}
                />
                {form.formState.errors.name && (
                  <p className="mt-1 text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 pt-6 border-t mt-6">
              <Button type="button" variant="outline" onClick={() => { setIsEditing(false); /* Reset form values on cancel via useEffect */ }}>
                <XCircle className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button type="submit" disabled={authLoading || form.formState.isSubmitting}>
                {authLoading || form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        // View Mode
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <Card className="md:col-span-1 shadow-xl">
            <CardHeader className="items-center text-center">
              <Avatar className="h-32 w-32 mb-4 border-4 border-primary/50 shadow-lg">
                <AvatarImage src={user.avatarUrl || `https://placehold.co/128x128/7c3aed/ffffff.png?text=${currentAvatarText}`} alt={user.name || "User avatar"} data-ai-hint="user avatar large" />
                <AvatarFallback className="text-4xl">{currentAvatarText}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{user.name || "User"}</CardTitle>
              {user.email && <CardDescription className="text-base">{user.email}</CardDescription>}
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
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
              <div className="pt-4">
                <Button variant="destructive" className="w-full sm:w-auto" disabled>Delete Account (Placeholder)</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
