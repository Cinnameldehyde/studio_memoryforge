
"use client";

import type { User } from '@/lib/types';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useLocalStorage } from './use-local-storage';
import { useToast } from './use-toast';
import { firebaseApp } from '@/lib/firebase'; // Import Firebase app
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  type User as FirebaseUser
} from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, name?: string) => Promise<void>; // For custom mock login
  signup: (email: string, name: string) => Promise<void>; // For custom mock signup
  signInWithGoogle: () => Promise<void>; // For Firebase Google Sign-In
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'memoryforge-users'; // For mock custom users
const CURRENT_USER_STORAGE_KEY = 'memoryforge-current-user';

const auth = getAuth(firebaseApp); // Initialize Firebase Auth

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useLocalStorage<User[]>(USERS_STORAGE_KEY, []); // Mock user DB for custom login
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>(CURRENT_USER_STORAGE_KEY, null);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();
  const { toast, dismiss } = useToast();

  useEffect(() => {
    // This effect handles the initial loading state based on the persisted currentUser from localStorage.
    // Firebase auth state is handled more directly by its methods.
    setIsLoading(false);
  }, [currentUser]);

  // Custom mock login
  const login = async (email: string, name?: string): Promise<void> => {
    setIsLoading(true);
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      setCurrentUser(existingUser);
      toast({ title: "Login Successful", description: `Welcome back, ${existingUser.name || existingUser.email}!` });
      router.push('/dashboard');
    } else if (name) { // For mock "Sign in with Google" if it were to use this path, or quick sign-up
      const newUser: User = { id: Date.now().toString(), email, name, avatarUrl: `https://placehold.co/40x40.png?text=${name.charAt(0).toUpperCase()}` };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      toast({ title: "Login Successful", description: `Welcome, ${name}!` });
      router.push('/dashboard');
    } else {
      toast({ title: "Login Failed", description: "User not found. Please sign up.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  // Custom mock signup
  const signup = async (email: string, name: string): Promise<void> => {
    setIsLoading(true);
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      toast({ title: "Signup Failed", description: "User already exists with this email.", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    const newUser: User = { id: Date.now().toString(), email, name, avatarUrl: `https://placehold.co/40x40.png?text=${name.charAt(0).toUpperCase()}` };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    toast({ title: "Signup Successful", description: `Welcome, ${name}!` });
    router.push('/dashboard');
    setIsLoading(false);
  };

  // Firebase Google Sign-In
  const signInWithGoogle = async (): Promise<void> => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    
    let unstableToastId: string | undefined = undefined;
    const unstableConnectionTimer = setTimeout(() => {
      const { id } = toast({
        title: "Network Status",
        description: "Connection seems a bit slow...",
        variant: "default",
        duration: 4000, // Auto-dismiss after 4 seconds
      });
      unstableToastId = id;
    }, 50); // 50ms threshold, very aggressive

    try {
      const result = await signInWithPopup(auth, provider);
      clearTimeout(unstableConnectionTimer); // Operation completed, clear timer
      if (unstableToastId) {
        dismiss(unstableToastId); // Dismiss the "slow" toast if it was shown
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
      clearTimeout(unstableConnectionTimer); // Operation failed, clear timer
      if (unstableToastId) {
        dismiss(unstableToastId); // Dismiss the "slow" toast if it was shown
      }
      console.error("Google Sign-In Error:", error);
      toast({ title: "Google Sign-In Failed", description: error.message || "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await firebaseSignOut(auth); // Sign out from Firebase
    } catch (error) {
      console.error("Firebase Sign-Out Error:", error);
      // Non-critical, proceed with local logout
    }
    setCurrentUser(null); // Clear user from localStorage
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    router.push('/login');
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user: currentUser, login, signup, signInWithGoogle, logout, isLoading }}>
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
