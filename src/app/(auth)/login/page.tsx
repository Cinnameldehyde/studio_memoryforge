import { LoginForm } from '@/components/auth/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - MemoryForge',
  description: 'Log in to your MemoryForge account.',
};

export default function LoginPage() {
  return <LoginForm />;
}
