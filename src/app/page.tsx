"use client";

import { Header } from "@/app/components/header/Header";
import BackgroundRays from "@/app/components/ui/BackgroundRays";
import { Chat } from "@/app/components/chat/Chat.client";

export default function Page() {
  return (
    <div className="flex flex-col h-screen w-full bg-bolt-elements-background-depth-1">
      <BackgroundRays />
      <Header />
      {/* Chat Component */}
      <Chat />
    </div>
  );
}
