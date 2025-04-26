import React from 'react';
import { Link } from 'solito/link';
import { YStack, XStack, H1, H2, H3, Text, Button, Card, Image } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { AIAssistant } from '../ai/AIAssistant';
import { agentFeatures } from '../../constants/agent-features';
import { testimonials } from '../../constants/testimonials';
import { HeroSection } from './sections/HeroSection';
import { FeatureCard } from './components/FeatureCard';
import { TestimonialCard } from './components/TestimonialCard';
import { CTASection } from './sections/CTASection';

interface AgentFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export function HomePage() {
  const { t } = useTranslation();

  return (
    <YStack f={1}>
      <HeroSection />

      {/* Agent Features Section */}
      <YStack bg="$gray1" py="$8" px="$4">
        <YStack maxWidth={1200} mx="auto" space="$6">
          <YStack ai="center" space="$4">
            <H2 color="$gray12">{t('home.features.title')}</H2>
            <Text size="$6" color="$gray11" ta="center" maw={600}>
              {t('home.features.subtitle')}
            </Text>
          </YStack>
          
          <XStack flexWrap="wrap" jc="center" space="$4">
            {agentFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </XStack>
        </YStack>
      </YStack>

      <CTASection />

      {/* Testimonials Section */}
      <YStack bg="$gray2" py="$8" px="$4">
        <YStack maxWidth={1200} mx="auto" space="$6">
          <H2 color="$gray12" ta="center">
            {t('home.testimonials.title')}
          </H2>
          
          <XStack flexWrap="wrap" jc="center" space="$4">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
              />
            ))}
          </XStack>
        </YStack>
      </YStack>

      <AIAssistant />
    </YStack>
  );
}

export default HomePage; 