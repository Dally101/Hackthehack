import React from 'react';
import Chatbot from '@/components/Chatbot';

// This component integrates all Azure AI components into the layout
export default function AzureAIProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Chatbot />
    </>
  );
}
