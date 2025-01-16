"use client";

import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";
import { cn } from "../lib/utils";
import { Clock, Trash2, MessageCircle, ChevronRight } from "lucide-react";

interface ChatHistoryProps {
  className?: string;
  selectedChatId: number | null;
  setSelectedChatId: (id: number) => void;
}

const chatDetails = [
  {
    id: 1,
    title: "Kubernetes Cluster Setup",
    description: "Deployment plan for infrastructure",
  },
  {
    id: 2,
    title: "Docker Deployment",
    description: "Microservices containerization",
  },
  { id: 3, title: "AWS Lambda Setup", description: "Serverless configuration" },
];

export function ChatHistorySidebar({
  className,
  selectedChatId,
  setSelectedChatId,
}: ChatHistoryProps) {
  return (
    <div
      className={cn(
        "flex flex-col h-full bg-gradient-to-b from-black/60 to-black/40 border-r border-white/10",
        "backdrop-blur-xl z-40",
        className
      )}
    >
      <div className="absolute inset-0 bg-cyan-500/10 blur-3xl rounded-full" />

      <div className="px-6 pt-6 bg-gradient-to-r from-black/40 via-[#01010101] to-black/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Clock className="w-5 h-5 text-white/80" />
          <div>
            <h2 className="text-xl font-bold  text-white/80 ">Recent Chats</h2>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-4">
          {" "}
          {/* Increased spacing between buttons */}
          {chatDetails.map((chat) => (
            <Button
              key={chat.id}
              variant="ghost"
              className={cn(
                "w-full justify-start text-left rounded-lg p-6 transition-all duration-300 group relative overflow-hidden",
                selectedChatId === chat.id
                  ? "bg-gradient-to-r from-blue-500/20 to-teal-400/20 text-white"
                  : "text-white/80 hover:text-white"
              )}
              onClick={() => setSelectedChatId(chat.id)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 flex items-start gap-3">
                <div className="flex flex-col gap-1">
                  <span
                    className={cn(
                      "font-medium text-sm transition-colors duration-300",
                      selectedChatId === chat.id
                        ? "text-blue-400"
                        : "group-hover:text-blue-400"
                    )}
                  >
                    {chat.title}
                  </span>
                  <span
                    className={cn(
                      "text-xs transition-colors duration-300",
                      selectedChatId === chat.id
                        ? "text-blue-300"
                        : "text-white/60 group-hover:text-white/80"
                    )}
                  >
                    {chat.description}
                  </span>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-white/10">
        {/* to do */}
        <Button
          variant="ghost"
          className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300
                     transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear History (to do)
        </Button>
      </div>
    </div>
  );
}
