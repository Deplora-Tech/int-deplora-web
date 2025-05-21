"use client";

import { useState } from "react";
import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";
import { cn } from "../lib/utils";
import { Clock, Trash2, MessageCircle, ChevronRight, Plus } from "lucide-react";
import { useSession } from "../hooks/session";
import { useMessages } from "../hooks/messages";

interface ChatHistoryProps {
  className?: string;
  selectedChatId: number | null;
  setSelectedChatId: (id: number | null) => void;
}

// This would typically come from an API in a real app
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
  const [chats, setChats] = useState(chatDetails);
  const [isAddingChat, setIsAddingChat] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [newChatDescription, setNewChatDescription] = useState("");
  const { setMessageHistory } = useMessages();

  const handleAddNewChat = () => {
    if (newChatTitle.trim() === "") return;

    // Generate a new unique ID
    const newId = Math.max(...chats.map((chat) => chat.id), 0) + 1;

    const newChat = {
      id: newId,
      title: newChatTitle,
      description: newChatDescription || "New conversation",
    };

    setChats([...chats, newChat]);
    setNewChatTitle("");
    setNewChatDescription("");
    setIsAddingChat(false);

    // Select the new chat
    setSelectedChatId(newId);
  };
  const handleCreateNewChat = () => {
    // Reset the selected chat and close the add form if open
    setSelectedChatId(null);
    setIsAddingChat(false);

    // Reset the message history
    setMessageHistory();

    // In a real app, you would create a new session via API
  };

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Clock className="w-5 h-5 text-white/80" />
            <div>
              <h2 className="text-xl font-bold text-white/80">Recent Chats</h2>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400"
            onClick={handleCreateNewChat}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-4">
          {isAddingChat && (
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <input
                type="text"
                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-md text-sm text-white focus:border-blue-500 focus:outline-none mb-2"
                placeholder="Chat Title"
                value={newChatTitle}
                onChange={(e) => setNewChatTitle(e.target.value)}
                autoFocus
              />
              <input
                type="text"
                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-md text-sm text-white focus:border-blue-500 focus:outline-none mb-2"
                placeholder="Description (optional)"
                value={newChatDescription}
                onChange={(e) => setNewChatDescription(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-white"
                  onClick={() => setIsAddingChat(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-blue-500 text-white hover:bg-blue-600"
                  onClick={handleAddNewChat}
                >
                  Add
                </Button>
              </div>
            </div>
          )}

          {chats.map((chat) => (
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
      </ScrollArea>{" "}
      <div className="p-4 border-t border-white/10">
        <Button
          variant="ghost"
          className="w-full mb-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300
                     transition-all duration-200 flex items-center justify-center gap-2"
          onClick={() => setIsAddingChat(true)}
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>

        <Button
          variant="ghost"
          className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300
                     transition-all duration-200 flex items-center justify-center gap-2"
          onClick={() => {
            // Clear chat history
            setChats([]);
            setSelectedChatId(null);
            setMessageHistory();
          }}
        >
          <Trash2 className="w-4 h-4" />
          Clear History
        </Button>
      </div>
    </div>
  );
}
