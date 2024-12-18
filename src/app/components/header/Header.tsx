"use client";

import { useState } from "react";
import { ChatDescription } from "../ui/ChatDescription.client";
import { HeaderActionButtons } from "./HeaderActionButtons.client";
import { classNames } from "@/app/utils/classNames";

export function Header() {
  const [chatStarted, setChatStarted] = useState(true); // Simulated state for chat

  return (
    <header
      className={classNames(
        "flex items-center p-5 border-b h-[var(--header-height)]",
        {
          "border-bolt-elements-borderColor": chatStarted,
        }
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center gap-2 z-logo text-bolt-elements-textPrimary cursor-pointer">
        <div className="i-ph:sidebar-simple-duotone text-xl" />
        <a
          href="/"
          className="text-2xl font-semibold text-accent flex items-center"
        >
          {/* <span className="i-bolt:logo-text?mask w-[46px] inline-block" /> */}
          <img
            src="/logo-light-styled.png"
            alt="logo"
            className="w-[90px] inline-block dark:hidden"
          />
          <img
            src="/logo-dark-styled.png"
            alt="logo"
            className="w-[90px] inline-block hidden dark:block"
          />
        </a>
      </div>

      {/* Conditional Content */}
    </header>
  );
}
