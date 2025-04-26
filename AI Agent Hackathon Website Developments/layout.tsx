import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AzureAIProvider from "@/components/AzureAIProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CSI Agentic AI Hackathon",
  description: "Connected Systems Institute Agentic AI Hackathon - April 25-27, 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AzureAIProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AzureAIProvider>
      </body>
    </html>
  );
}
