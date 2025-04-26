import { Check } from '@tamagui/lucide-icons';

export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  features: PricingFeature[];
  stripePriceId: string;
  highlighted?: boolean;
}

export const pricingFeatures = {
  participantLimit: (limit: number) => ({
    text: `Up to ${limit} participants per event`,
    included: true
  }),
  eventLimit: (limit: number) => ({
    text: `Up to ${limit} events per year`,
    included: true
  }),
  aiAssistant: {
    text: 'AI Assistant for event management',
    included: true
  },
  customBranding: {
    text: 'Custom branding and white-labeling',
    included: true
  },
  analytics: {
    text: 'Advanced analytics and reporting',
    included: true
  },
  apiAccess: {
    text: 'API access',
    included: true
  },
  prioritySupport: {
    text: '24/7 priority support',
    included: true
  },
  teamManagement: {
    text: 'Team management features',
    included: true
  }
};

export const pricingTiers: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small hackathons and educational events',
    price: 49,
    billingPeriod: 'monthly',
    stripePriceId: 'price_starter_monthly',
    features: [
      pricingFeatures.participantLimit(100),
      pricingFeatures.eventLimit(2),
      pricingFeatures.aiAssistant,
      { text: 'Basic analytics', included: true },
      { text: 'Email support', included: true },
      { text: 'Custom branding', included: false },
      { text: 'API access', included: false },
      { text: 'Team management', included: false }
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Ideal for universities and growing organizations',
    price: 99,
    billingPeriod: 'monthly',
    stripePriceId: 'price_professional_monthly',
    highlighted: true,
    features: [
      pricingFeatures.participantLimit(500),
      pricingFeatures.eventLimit(5),
      pricingFeatures.aiAssistant,
      pricingFeatures.analytics,
      pricingFeatures.customBranding,
      { text: 'Priority email support', included: true },
      pricingFeatures.apiAccess,
      { text: 'Basic team management', included: true }
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large-scale events and organizations',
    price: 299,
    billingPeriod: 'monthly',
    stripePriceId: 'price_enterprise_monthly',
    features: [
      pricingFeatures.participantLimit(2000),
      { text: 'Unlimited events', included: true },
      pricingFeatures.aiAssistant,
      pricingFeatures.analytics,
      pricingFeatures.customBranding,
      pricingFeatures.prioritySupport,
      pricingFeatures.apiAccess,
      pricingFeatures.teamManagement
    ]
  }
]; 