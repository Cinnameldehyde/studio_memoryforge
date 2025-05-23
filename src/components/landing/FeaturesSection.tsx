
import { Brain, Zap, BarChart3, RefreshCw } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import React from 'react';

const features = [
  {
    icon: RefreshCw,
    title: "Intelligent Spaced Repetition",
    description: "Our SM-2 algorithm optimizes your review schedule, ensuring you learn efficiently and retain information longer.",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights (Coming Soon)",
    description: "Leverage generative AI to create flashcards, get explanations, and enhance your learning journey.",
  },
  {
    icon: BarChart3,
    title: "Track Your Progress",
    description: "Visualize your learning habits and mastery with intuitive dashboards and statistics.",
  },
  {
    icon: Zap,
    title: "Seamless & Fast",
    description: "A modern, responsive interface designed for quick study sessions on any device.",
  },
];

interface FeaturesSectionProps {
  id: string;
  ref: React.RefObject<HTMLDivElement>;
}

export const FeaturesSection = React.memo(React.forwardRef<HTMLDivElement, FeaturesSectionProps>(({ id }, ref) => {
  return (
    <section id={id} ref={ref} className="py-12 md:py-16 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-shadow-md mb-4">
            Why <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--chart-5))] via-[hsl(330_70%_70%)] to-[hsl(45_100%_90%)]">MemoryForge</span>?
          </h2>
          <p className="text-lg text-white text-shadow-sm max-w-2xl mx-auto">
            Supercharge your learning with features designed for effectiveness and ease of use.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
}));
FeaturesSection.displayName = 'FeaturesSection';
