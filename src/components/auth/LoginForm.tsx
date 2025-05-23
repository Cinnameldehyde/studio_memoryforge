
"use client";

import { useAuth } from '@/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Google SVG Icon
const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" width="1em" height="1em" className="mr-2 h-4 w-4">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
    <path fill="none" d="M0 0h48v48H0z"></path>
  </svg>
);


const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }), 
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login, signInWithGoogle, isLoading } = useAuth();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "", 
    },
  });

  const onSubmitCustomLogin = async (data: LoginFormValues) => {
    await login(data.email, data.email); 
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle(); 
  };
  
  const buttonClassName = "w-full font-bold bg-background text-primary border-2 border-primary rounded-md h-10 px-4 py-2 hover:ring-2 hover:ring-primary hover:ring-offset-1 hover:ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  return (
    <Card className="w-full shadow-xl bg-card/80 backdrop-blur-md border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Enter your credentials to access your MemoryForge account.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitCustomLogin)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password (mock)</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className={buttonClassName} disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login with Email'}
            </Button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button 
              type="button" 
              className={buttonClassName}
              onClick={handleGoogleSignIn} 
              disabled={isLoading}
            >
              <GoogleIcon />
              Sign in with Google
            </Button>
          </CardContent>
        </form>
      </Form>
      <CardFooter className="flex-col items-start">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
