"use client";

import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ChatHistorySidebar } from "../chat-history";

interface HeaderProps {
  selectedChatId: number | null;
  setSelectedChatId: (id: number | null) => void;
  chatDetails: Array<{ id: number; title: string }>;
}

export function Header({
  selectedChatId,
  setSelectedChatId,
  chatDetails,
}: HeaderProps) {
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
  const selectedChatTitle = chatDetails.find(
    (chat) => chat.id === selectedChatId
  )?.title;

  return (
    <>
      <header className="relative flex h-14 items-center border-b border-white/[0.1] bg-gradient-to-r from-black/40 via-[#01010101] to-black backdrop-blur-md z-50">
        <div className="flex items-center justify-between w-full px-4">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
              <button onClick={() => (window.location.href = "/")}>
                Deplora
              </button>{" "}
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

      {/* Chat History Component */}
      {isChatHistoryOpen && (
        <ChatHistorySidebar
          className="absolute top-14 left-0 w-72 h-[calc(100vh-3.5rem)]"
          selectedChatId={selectedChatId}
          setSelectedChatId={setSelectedChatId}
        />
      )}
    </>
  );
}
