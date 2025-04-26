export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatarUrl: string;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Hackathon Organizer',
    content: 'The AI assistant transformed how we manage hackathons. It reduced our workload by 70% and improved participant satisfaction significantly.',
    avatarUrl: '/avatars/sarah-chen.jpg'
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    role: 'Student Participant',
    content: 'Having an AI guide throughout the hackathon made the experience much smoother. From team formation to project submission, everything was seamless.',
    avatarUrl: '/avatars/marcus-rodriguez.jpg'
  },
  {
    id: '3',
    name: 'Dr. Emily Watson',
    role: 'University Professor',
    content: 'As a judge, the AI system helped me evaluate projects more efficiently and fairly. The automated scoring system was particularly impressive.',
    avatarUrl: '/avatars/emily-watson.jpg'
  }
]; 