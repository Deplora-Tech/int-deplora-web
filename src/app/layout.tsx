"use client";

import { ArrowUpRight, ChevronDown, Download, Zap } from "lucide-react";
import "./globals.css";
import { Button } from "./components/ui/button";
import { MessageProvider } from "./hooks/messages";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <MessageProvider>
        <body className="min-h-screen flex flex-col bg-[#011521] text-white overflow-hidden">
          {/* Gradient background */}
          <div className="fixed inset-0">
            {/* Base dark gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-[#0a0a0a] to-[#010101]" />

            {/* Light source effect at the top */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,170,255,0.01),rgba(0,0,0,0))]" />

            {/* Slight texture overlay for depth */}
            <div className="absolute inset-0 bg-noise opacity-5 mix-blend-overlay" />
          </div>

          <div className="relative flex flex-col flex-1">
            <header className="relative flex h-14 items-center border-b border-white/[0.1] bg-gradient-to-r from-black/40 via-[#01010101] to-black backdrop-blur-md">
              {/* Gradient positioned at the top-right border */}

              <div className="flex items-center justify-between w-full px-4">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
                    Deplora
                  </span>
                  <Button
                    variant="ghost"
                    className="h-8 gap-2 bg-white/[0.02] hover:bg-white/[0.05]"
                  >
                    <span className="text-sm text-white">
                      Create a new React application
                    </span>
                    <ChevronDown className="w-4 h-4 text-neutral-500" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-neutral-400 hover:text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-neutral-400 hover:text-white"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Connect to Supabase
                  </Button>
                  <Button
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    Deploy
                  </Button>
                </div>
              </div>
            </header>

            <main className="flex-1 flex min-h-0 overflow-hidden p-6 gap-6">
              {children}
            </main>
          </div>
          <style jsx global>{`
            .bg-noise {
              background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            }

            .gradient-border {
              position: relative;
              background: rgba(0, 0, 0, 0.2);
              backdrop-filter: blur(12px);
              border-radius: 8px;
            }

            .gradient-border::before {
              content: "";
              position: absolute;
              inset: -1px;
              background: linear-gradient(
                180deg,
                rgba(255, 255, 255, 0.1) 0%,
                transparent 100%
              );
              border-radius: 9px;
              z-index: -1;
              pointer-events: none;
            }
          `}</style>
        </body>
      </MessageProvider>
    </html>
  );
}
