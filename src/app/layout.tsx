"use client";

import "./globals.css";
import { useState } from "react";
import Providers from "./providers";
import { Background } from "./components/layout/Background";
import { Header } from "./components/layout/Header";

// Mock data - in a real app, this would come from an API or state management
const chatDetails = [
  { id: 1, title: "Kubernetes Cluster Setup" },
  { id: 2, title: "Docker Deployment" },
  { id: 3, title: "AWS Lambda Setup" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

  return (
    <html lang="en" className="dark">
      <Providers>
        <body className="min-h-screen flex flex-col bg-[#011521] text-white overflow-hidden">
          <Background />

          <div className="relative flex flex-col flex-1">
            <Header
              selectedChatId={selectedChatId}
              setSelectedChatId={setSelectedChatId}
              chatDetails={chatDetails}
            />

            <main className="flex-1 flex min-h-0 overflow-hidden gap-6">
              {children}
            </main>
          </div>
        </body>
      </Providers>
    </html>
  );
}
