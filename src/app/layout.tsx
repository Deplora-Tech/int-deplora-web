"use client";

import { ArrowUpRight, Menu, X, ChevronDown } from "lucide-react";
import "./globals.css";
import { Button } from "./components/ui/button";
import { ChatHistorySidebar } from "./components/chat-history"; // Import the ChatHistorySidebar component
import { MessageProvider } from "./hooks/messages";
import { PipelineProvider } from "./hooks/pipeline";
import { SessionProvider } from "./hooks/session";
import { useState } from "react";

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
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

  // Get the title of the selected chat
  const selectedChatTitle = chatDetails.find(
    (chat) => chat.id === selectedChatId
  )?.title;

  return (
    <html lang="en" className="dark">
      <SessionProvider>
      <MessageProvider>
        <PipelineProvider>
        <body className="min-h-screen flex flex-col bg-[#011521] text-white overflow-hidden">
          {/* Gradient background */}
          <div className="fixed inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#0a0a0a] to-[#010101]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,170,255,0.01),rgba(0,0,0,0))]" />
            <div className="absolute inset-0 bg-noise opacity-5 mix-blend-overlay" />
          </div>

          <div className="relative flex flex-col flex-1">
            <header className="relative flex h-14 items-center border-b border-white/[0.1] bg-gradient-to-r from-black/40 via-[#01010101] to-black backdrop-blur-md z-50">
              {/* Header layout */}
              <div className="flex items-center justify-between w-full px-4">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
                    Deplora
                  </span>

                  {/* Stylish Current Chat Button */}
                  <div
                    className="relative group"
                    onClick={() => setIsChatHistoryOpen(!isChatHistoryOpen)}
                  >
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gradient-to-r from-blue-500/10 to-teal-400/10 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer">
                      {isChatHistoryOpen ? (
                        <X className="w-4 h-4 text-blue-400" />
                      ) : (
                        <Menu className="w-4 h-4 text-blue-400" />
                      )}
                      <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                        {selectedChatTitle || "Select a Chat"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors" />
                    </div>
                  </div>
                </div>

                
              </div>
            </header>

            <main className="flex-1 flex min-h-0 overflow-hidden gap-6">
              {/* Chat History Component */}
              {isChatHistoryOpen && (
                <ChatHistorySidebar
                  className="absolute top-14 left-0 w-72 h-[calc(100vh-3.5rem)]"
                  selectedChatId={selectedChatId}
                  setSelectedChatId={setSelectedChatId} // Pass state handler
                />
              )}
              {children}
            </main>
          </div>
          <style jsx global>{`
            .bg-noise {
              background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            }
          `}</style>
        </body>
        </PipelineProvider>
      </MessageProvider>
      </SessionProvider>
    </html>
  );
}