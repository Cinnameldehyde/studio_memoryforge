"use client";

import type { User } from '@/lib/types';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useLocalStorage } from './use-local-storage';
import { useToast } from './use-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, name?: string) => Promise<void>; // Simplified login
  signup: (email: string, name: string) => Promise<void>; // Simplified signup
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database stored in localStorage
const USERS_STORAGE_KEY = 'memoryforge-users';
const CURRENT_USER_STORAGE_KEY = 'memoryforge-current-user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useLocalStorage<User[]>(USERS_STORAGE_KEY, []);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>(CURRENT_USER_STORAGE_KEY, null);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();
  const { toast } = useToast();

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
    } else {
      // For "Sign in with Google" mock or if user doesn't exist via custom login
      if (name) { // Likely from Google Sign-in mock
        const newUser: User = { id: Date.now().toString(), email, name, avatarUrl: `https://placehold.co/40x40.png?text=${name.charAt(0).toUpperCase()}` };
        setUsers([...users, newUser]);
        setCurrentUser(newUser);
        toast({ title: "Login Successful", description: `Welcome, ${name}!` });
        router.push('/dashboard');
      } else {
        toast({ title: "Login Failed", description: "User not found. Please sign up.", variant: "destructive" });
      }
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
    const newUser: User = { id: Date.now().toString(), email, name, avatarUrl: `https://placehold.co/40x40.png?text=${name.charAt(0).toUpperCase()}` };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    toast({ title: "Signup Successful", description: `Welcome, ${name}!` });
    router.push('/dashboard');
    setIsLoading(false);
  };

  const logout = () => {
    setCurrentUser(null);
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user: currentUser, login, signup, logout, isLoading }}>
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
