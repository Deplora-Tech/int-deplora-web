import { ScrollArea } from "../components/ui/scroll-area";
import { GitBranch, MessageSquare } from "lucide-react";

type Chat = {
  id: number;
  type: "deployment" | "conversation";
  title: string;
  branch?: string;
};

type ChatListProps = {
  chats: Chat[];
  selectedChatId: number;
  onSelectChat: (chatId: number) => void;
};

export function ChatList({
  chats,
  selectedChatId,
  onSelectChat,
}: ChatListProps) {
  return (
    <div className="w-80 border-r border-zinc-800 bg-black/50 backdrop-blur-xl">
      <div className="p-4">
        <h3 className="mb-4 text-sm font-medium text-zinc-400">
          Project Chats
        </h3>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`mb-2 flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                selectedChatId === chat.id
                  ? "border-cyan-600 bg-cyan-950/20"
                  : "border-zinc-800 bg-black/50 hover:border-cyan-900 hover:bg-cyan-950/10"
              }`}
            >
              <MessageSquare className="h-5 w-5 text-zinc-400" />
              <div className="flex-1">
                <div className="text-sm font-medium text-zinc-200">
                  {chat.title}
                </div>
                {chat.branch && (
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <GitBranch className="h-3 w-3" />
                    {chat.branch}
                  </div>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}
