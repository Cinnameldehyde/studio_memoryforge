
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - MemoryForge',
  description: 'Create a new MemoryForge account.',
};

export default function SignupPage() {
  // The actual SignupForm UI is rendered by AuthLayout.tsx for the flip animation.
  // This page component primarily serves for routing and metadata.
  return null;
}
