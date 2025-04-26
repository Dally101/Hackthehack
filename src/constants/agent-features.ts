import { IconProps } from '@tamagui/helpers';
import {
  UserCheck,
  Calendar,
  MessageSquare,
  Award,
  Users,
  Briefcase,
  Shield,
  Star
} from '@tamagui/lucide-icons';

export interface AgentFeature {
  icon: React.FC<IconProps>;
  title: string;
  description: string;
}

export const agentFeatures: AgentFeature[] = [
  {
    icon: UserCheck,
    title: 'Streamlined Participant Signup',
    description: 'Automates the registration process and validates participant eligibility.'
  },
  {
    icon: Calendar,
    title: 'Schedule Management',
    description: 'Optimizes event scheduling and sends timely reminders.'
  },
  {
    icon: MessageSquare,
    title: 'Communication Assistant',
    description: 'Facilitates seamless communication between organizers and participants.'
  },
  {
    icon: Award,
    title: 'Project Evaluation',
    description: 'Assists in fair and efficient project judging process.'
  },
  {
    icon: Users,
    title: 'Team Formation',
    description: 'Helps match participants based on skills and interests.'
  },
  {
    icon: Briefcase,
    title: 'Resource Management',
    description: 'Tracks and allocates resources efficiently.'
  },
  {
    icon: Shield,
    title: 'Compliance Monitor',
    description: 'Ensures adherence to hackathon rules and guidelines.'
  },
  {
    icon: Star,
    title: 'Experience Enhancement',
    description: 'Provides personalized support to improve participant experience.'
  }
]; 