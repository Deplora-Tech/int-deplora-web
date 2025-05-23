"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { MessageSquare, X, ChevronDown } from "lucide-react";
import { ChatHistorySidebar } from "../../chat-history";
import { Dropdown } from "../../ui/dropdown";

interface ChatSelectorProps {
  selectedChatId: string | null;
  setSelectedChatId: (id: string | null) => void;
  chatDetails: Array<{ id: string; title: string }>;
  className?: string;
}

export function ChatSelector({
  selectedChatId,
  setSelectedChatId,
  chatDetails,
  className,
}: ChatSelectorProps) {
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);

  const selectedChatTitle = chatDetails.find(
    (chat) => chat.id === selectedChatId
  )?.title;
  // Handle keyboard events
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && isChatHistoryOpen) {
      setIsChatHistoryOpen(false);
    }
  };

  // Global escape key handler for when focus is outside the dropdown
  useEffect(() => {
    // Only add the global listener if the dropdown is open
    if (!isChatHistoryOpen) return;

    const handleGlobalEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsChatHistoryOpen(false);
      }
    };

    document.addEventListener("keydown", handleGlobalEscape as any);

    return () => {
      document.removeEventListener("keydown", handleGlobalEscape as any);
    };
  }, [isChatHistoryOpen]);

  const trigger = (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gradient-to-r from-blue-500/10 to-teal-400/10 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
      data-chat-toggle="true"
    >
      {isChatHistoryOpen ? (
        <X className="w-4 h-4 text-blue-400" />
      ) : (
        <MessageSquare className="w-4 h-4 text-blue-400" />
      )}
      <span className="text-sm font-medium text-white/80">
        {selectedChatTitle || "New Chat"}
      </span>
      <ChevronDown className="w-4 h-4 text-white/50" />
    </div>
  );
  return (
    <Dropdown
      trigger={trigger}
      isOpen={isChatHistoryOpen}
      onOpenChange={setIsChatHistoryOpen}
      className={`group ${className}`}
      selectorAttribute="data-chat-toggle"
      id="chat-selector-dropdown"
      focusFirstItemOnOpen={true}
    >
      <div
        className="fixed top-0 left-0 h-screen w-72 bg-black/90 backdrop-blur-md border-r border-white/10 shadow-lg overflow-hidden z-50"
        onKeyDown={handleKeyDown}
        role="menu"
      >
        <ChatHistorySidebar
          className="w-full h-full"
          selectedChatId={selectedChatId}
          setSelectedChatId={(id) => {
            setSelectedChatId(id);
            setIsChatHistoryOpen(false); // Close sidebar after selection
          }}
        />
      </div>
    </Dropdown>
  );
}
