
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - MemoryForge',
  description: 'Log in to your MemoryForge account.',
};

export default function LoginPage() {
  // The actual LoginForm UI is rendered by AuthLayout.tsx for the flip animation.
  // This page component primarily serves for routing and metadata.
  return null;
}
