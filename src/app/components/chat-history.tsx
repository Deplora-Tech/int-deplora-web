"use client";

import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";
import { cn } from "../lib/utils";
import {
  MessageSquare,
  Trash2,
  Plus,
  Calendar,
  MessageCircle,
} from "lucide-react";
import { useSession } from "../hooks/session";
import { useMessages } from "../hooks/messages";
import { DropdownForm } from "./ui/dropdown-form";
import { groupChatsByDate } from "../lib/date-utils";

interface ChatHistoryProps {
  className?: string;
  selectedChatId: string | null;
  setSelectedChatId: (id: string | null) => void;
}

// This would typically come from an API in a real app

export function ChatHistorySidebar({
  className,
  selectedChatId,
  setSelectedChatId,
}: ChatHistoryProps) {
  const [isAddingChat, setIsAddingChat] = useState(false);
  const { setMessageHistory, chatList } = useMessages();

  const handleCreateNewChat = () => {
    setSelectedChatId(null);
    setIsAddingChat(false);
    setMessageHistory();
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-gradient-to-b from-black/70 to-black/50 border-r border-white/10",
        "backdrop-blur-xl z-40",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-teal-400/5 blur-3xl rounded-full pointer-events-none" />
      <div className="px-6 pt-6 bg-gradient-to-r from-black/40 via-[#01010101] to-black/40 backdrop-blur-md relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
                Conversations
              </h2>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500/20 to-teal-400/20 hover:from-blue-500/30 hover:to-teal-400/30 text-blue-400"
            onClick={handleCreateNewChat}
            title="Start New Conversation"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>{" "}
      </div>{" "}
      <ScrollArea className="flex-1 px-2 py-4 relative z-10">
        <div className="space-y-4">
          {isAddingChat && (
            <DropdownForm
              title="New Conversation"
              inputPlaceholder="Conversation Title"
              descriptionPlaceholder="Description (optional)"
              showDescription={true}
              submitButtonText="Create"
              onSubmit={(title) => {}}
              onCancel={() => setIsAddingChat(false)}
              className="rounded-lg"
            />
          )}
          {chatList &&
            groupChatsByDate(chatList).map((group) => (
              <div key={group.label} className="space-y-2">
                <h3 className="text-xs font-medium text-white/50 px-3 py-1">
                  {group.label}
                </h3>
                <div className="space-y-1">
                  {group?.chats?.map((chat) => (
                    <Button
                      key={chat.session_id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-left rounded-lg py-3 px-4 transition-all duration-300 group relative overflow-hidden pt-6 pb-6",
                        selectedChatId === chat.session_id
                          ? "bg-gradient-to-r from-blue-500/20 to-teal-400/20 text-white border border-white/10"
                          : "text-white/80 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-teal-400/10"
                      )}
                      onClick={() => {
                        window.location.href = `/chat/${chat.session_id}`;
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-teal-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative z-10 flex items-center gap-3 w-full">
                        <MessageCircle
                          className={cn(
                            "w-5 h-5 flex-shrink-0",
                            selectedChatId === chat.session_id
                              ? "text-blue-400"
                              : "text-white/50 group-hover:text-blue-400"
                          )}
                        />{" "}
                        <div className="flex flex-col gap-0.5 w-52 min-w-0">
                          <span
                            className={cn(
                              "font-medium text-sm transition-colors duration-300 whitespace-nowrap overflow-hidden text-ellipsis",
                              selectedChatId === chat.session_id
                                ? "text-blue-300"
                                : "group-hover:text-blue-300"
                            )}
                            title={chat.title}
                          >
                            {chat.title}
                          </span>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </ScrollArea>{" "}
      <div className="p-4 border-t border-white/10 relative z-10">
        <Button
          variant="ghost"
          className="w-full mb-3 bg-gradient-to-r from-blue-500/10 to-teal-400/10 hover:from-blue-500/20 hover:to-teal-400/20 text-white/90 hover:text-white
                     transition-all duration-200 flex items-center justify-center gap-2 py-2"
          onClick={() => setIsAddingChat(true)}
        >
          <Plus className="w-4 h-4 text-blue-400" />
          <span>New Conversation</span>
        </Button>
      </div>
    </div>
  );
}
