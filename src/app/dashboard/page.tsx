"use client";

import { useState } from "react";
import { ProjectHeader } from "./ProjectHeader";
import { ChatList } from "./ChatList";
import { DeploymentPlan } from "./DeploymentPlan";
import { DeploymentExecution } from "./DeploymentExecution";
import { DeploymentTimeline } from "./DeploymentTimeline";
import { ConversationChat } from "./ConversationChat";
import { Button } from "../components/ui/button";
import { ArrowUpRight } from "lucide-react";

const tabs = [
  { id: "plan", label: "Deployment Plan" },
  { id: "execution", label: "Execution" },
  { id: "timeline", label: "Timeline" },
];

export default function DeploymentDashboard() {
  const [activeTab, setActiveTab] = useState("plan");
  const [selectedChatId, setSelectedChatId] = useState(1);

  // Mock data for chats - this would come from an API in a real application
  const chats = [
    {
      id: 1,
      type: "deployment",
      title: "Deployment Chat #1",
      branch: "feature/auth-1",
    },
    { id: 2, type: "conversation", title: "General Discussion" },
    { id: 3, type: "conversation", title: "Team Updates" },
  ];

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  const renderContent = () => {
    if (selectedChat?.type === "conversation") {
      return <ConversationChat />;
    }

    switch (activeTab) {
      case "plan":
        return <DeploymentPlan />;
      case "execution":
        return <DeploymentExecution />;
      case "timeline":
        return <DeploymentTimeline />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen flex-col bg-w w-full">
      <ProjectHeader />

      <div className="flex flex-1 overflow-hidden">
        <ChatList
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
        />

        <div className="flex-1 bg-gradient-to-b from-cyan-950/20 to-black">
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-1 border-b border-zinc-800 px-2">
              {selectedChat?.type === "deployment" ? (
                <>
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative rounded-t-lg border-x border-t px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? "border-zinc-800 bg-black/50 text-cyan-500 after:absolute after:bottom-[-1px] after:left-0 after:h-[2px] after:w-full after:bg-cyan-500"
                          : "border-transparent text-zinc-400 hover:text-zinc-300"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </>
              ) : (
                <div className="px-4 py-2 text-sm font-medium text-zinc-400">
                  Conversation Chat
                </div>
              )}
              <div className="ml-auto pr-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 border-cyan-800 bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20"
                >
                  <span>Open Workspace</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6">{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
