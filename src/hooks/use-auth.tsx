
"use client";

import type { User } from '@/lib/types';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useLocalStorage } from './use-local-storage';
import { useToast } from './use-toast';
import { firebaseApp } from '@/lib/firebase';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  type User as FirebaseUser
} from 'firebase/auth';

export const DEFAULT_MOCK_USER_ID = 'default-mock-user-001';
export const DEFAULT_MOCK_USER_EMAIL = 'name@example.com';

interface UpdateUserProfileData {
  name?: string;
  avatarUrl?: string; // Expected to be a data URI
}

interface AuthContextType {
  user: User | null;
  login: (email: string, name?: string) => Promise<void>;
  signup: (email: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  updateUserProfile: (data: UpdateUserProfileData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'memoryforge-users';
const CURRENT_USER_STORAGE_KEY = 'memoryforge-current-user';

const auth = getAuth(firebaseApp);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useLocalStorage<User[]>(USERS_STORAGE_KEY, []);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>(CURRENT_USER_STORAGE_KEY, null);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();
  const { toast, dismiss } = useToast();

  useEffect(() => {
    setIsLoading(false);
  }, [currentUser]);

  const login = async (email: string, name?: string): Promise<void> => {
    setIsLoading(true);
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      setCurrentUser(existingUser);
      toast({ title: "Login Successful", description: `Welcome back, ${existingUser.name || existingUser.email}!` });
      router.push('/dashboard');
    } else if (email === DEFAULT_MOCK_USER_EMAIL && name) { // Special handling for default mock user creation
        const newUser: User = { id: DEFAULT_MOCK_USER_ID, email, name, avatarUrl: `https://placehold.co/40x40.png?text=${name.charAt(0).toUpperCase()}` };
        setUsers([...users, newUser]);
        setCurrentUser(newUser);
        toast({ title: "Login Successful", description: `Welcome, ${name}!` });
        router.push('/dashboard');
    } else if (name) { // General new user from mock login if name provided (less common path now)
      const newUser: User = { id: Date.now().toString(), email, name, avatarUrl: `https://placehold.co/40x40.png?text=${name.charAt(0).toUpperCase()}` };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      toast({ title: "Login Successful", description: `Welcome, ${name}!` });
      router.push('/dashboard');
    }
     else {
      toast({ title: "Login Failed", description: "User not found. Please sign up.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  const signup = async (email: string, name: string): Promise<void> => {
    setIsLoading(true);
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      toast({ title: "Signup Failed", description: "User already exists with this email.", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    const newUserId = email === DEFAULT_MOCK_USER_EMAIL ? DEFAULT_MOCK_USER_ID : Date.now().toString();
    const newUser: User = { id: newUserId, email, name, avatarUrl: `https://placehold.co/40x40.png?text=${name.charAt(0).toUpperCase()}` };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    toast({ title: "Signup Successful", description: `Welcome, ${name}!` });
    router.push('/dashboard');
    setIsLoading(false);
  };

  const signInWithGoogle = async (): Promise<void> => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    
    let unstableToastId: string | undefined = undefined;
    const unstableConnectionTimer = setTimeout(() => {
      const { id } = toast({
        title: "Network Status",
        description: "Connection seems a bit slow...",
        variant: "default",
        duration: 5000,
      });
      unstableToastId = id;
    }, 3000);

    try {
      const result = await signInWithPopup(auth, provider);
      clearTimeout(unstableConnectionTimer);
      if (unstableToastId) {
        dismiss(unstableToastId);
      }

      const firebaseUser: FirebaseUser = result.user;
      
      const appUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || undefined,
        name: firebaseUser.displayName || 'User',
        avatarUrl: firebaseUser.photoURL || `https://placehold.co/40x40.png?text=${(firebaseUser.displayName || 'U').charAt(0).toUpperCase()}`,
      };
      setCurrentUser(appUser);
      
      toast({ title: "Google Sign-In Successful", description: `Welcome, ${appUser.name}!` });
      router.push('/dashboard');
    } catch (error: any) {
      clearTimeout(unstableConnectionTimer);
      if (unstableToastId) {
        dismiss(unstableToastId);
      }
      console.error("Google Sign-In Error:", error);
      toast({ title: "Google Sign-In Failed", description: error.message || "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (data: UpdateUserProfileData): Promise<void> => {
    if (!currentUser) {
      toast({ title: "Update Failed", description: "No user logged in.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const updatedUser = { ...currentUser };
      if (data.name && data.name.trim() !== "") {
        updatedUser.name = data.name.trim();
      }
      // Only update avatarUrl if a new one is provided (it won't be undefined if they didn't select a file)
      // but it could be null or empty string if we intentionally want to clear it.
      // For now, we only update if a new valid data.avatarUrl is passed.
      if (data.avatarUrl) {
        updatedUser.avatarUrl = data.avatarUrl;
      }
      
      setCurrentUser(updatedUser);

      // Update in the mock users array as well if they were a mock user
      const userIndex = users.findIndex(u => u.id === updatedUser.id);
      if (userIndex > -1) {
        const updatedUsers = [...users];
        updatedUsers[userIndex] = updatedUser;
        setUsers(updatedUsers);
      }

      toast({ title: "Profile Updated", description: "Your profile has been successfully updated." });
    } catch (error) {
      console.error("Profile Update Error:", error);
      toast({ title: "Update Failed", description: "Could not update profile.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Firebase Sign-Out Error:", error);
    }
    setCurrentUser(null);
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    router.push('/login');
    // Small delay to ensure local storage clear and redirect complete before setting loading to false
    // This can prevent race conditions with protected routes if Nav happens too quickly.
    setTimeout(() => setIsLoading(false), 100);
  };

  return (
    <AuthContext.Provider value={{ user: currentUser, login, signup, signInWithGoogle, logout, isLoading, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
