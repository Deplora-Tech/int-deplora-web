"use client";

import { ChevronRight } from "lucide-react";
import { useMessages } from "@/app/hooks/messages";
import { Logo } from "./SubHeader/Logo";
import { OrganizationDropdown } from "./SubHeader/OrganizationDropdown";
import { ChatSelector } from "./SubHeader/ChatSelector";

interface HeaderProps {
  selectedChatId: string | null;
  setSelectedChatId: (id: string | null) => void;
  chatDetails: Array<{ id: string; title: string }>;
}

export function Header({
  selectedChatId,
  setSelectedChatId,
  chatDetails,
}: HeaderProps) {
  const handleLogoClick = () => {
    window.location.href = "/";
  };

  return (
    <header className="relative flex h-14 items-center border-b border-white/[0.1] bg-gradient-to-r from-black/40 via-[#01010101] to-black backdrop-blur-md z-50">
      <div className="flex items-center justify-between w-full px-4">
        <div className="flex items-center gap-4">
          <Logo size="md" onClick={handleLogoClick} />

          <div
            className="flex items-center"
            role="navigation"
            aria-label="Main navigation"
          >
            <OrganizationDropdown />

            <ChevronRight
              className="w-4 h-4 text-blue-400 mx-2"
              aria-hidden="true"
            />

            <ChatSelector
              selectedChatId={selectedChatId}
              setSelectedChatId={setSelectedChatId}
              chatDetails={chatDetails}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
