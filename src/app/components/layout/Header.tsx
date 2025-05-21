"use client";

import {
  Menu,
  X,
  ChevronDown,
  ArrowBigRight,
  ChevronRight,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ChatHistorySidebar } from "../chat-history";
import { useOrganizations } from "@/app/hooks/organizations";
import { useSession } from "@/app/hooks/session";
import { useMessages } from "@/app/hooks/messages";

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
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const { org, setOrg, organizations, createOrg } = useOrganizations();
  const { messages } = useMessages();
  const [newOrgName, setNewOrgName] = useState("");
  const [isAddingOrg, setIsAddingOrg] = useState(false);
  const selectedChatTitle = chatDetails.find(
    (chat) => chat.id === selectedChatId
  )?.title;

  const handleOrgSelect = (selectedOrg: any) => {
    setOrg(selectedOrg);
    setIsOrgDropdownOpen(false);
    localStorage.setItem("org", selectedOrg.id);
  };
  const handleAddNewOrg = async () => {
    if (newOrgName.trim() === "") return;

    try {
      await createOrg(newOrgName, "");
      setIsAddingOrg(false);
      setNewOrgName("");
      setIsOrgDropdownOpen(false);
    } catch (error) {
      console.error("Error creating organization:", error);
    }
  };

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

            {/* Organization Selector */}
            <div className="relative group">
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gradient-to-r from-blue-500/10 to-teal-400/10 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
              >
                <Menu className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                  {org?.name || "Select Organization"}
                </span>
                <ChevronDown className="w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors" />
              </div>

              {/* Organization dropdown */}
              {isOrgDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-black/90 border border-white/10 rounded-md shadow-lg z-50 overflow-hidden">
                  <div className="py-1">
                    {organizations.map((organization) => (
                      <div
                        key={organization.id}
                        className="px-4 py-2 text-sm text-white/80 hover:bg-blue-500/20 cursor-pointer"
                        onClick={() => handleOrgSelect(organization)}
                      >
                        {organization.name}
                      </div>
                    ))}

                    {!isAddingOrg ? (
                      <div
                        className="flex items-center gap-2 px-4 py-2 text-sm text-blue-400 hover:bg-blue-500/10 cursor-pointer border-t border-white/10"
                        onClick={() => setIsAddingOrg(true)}
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Organization</span>
                      </div>
                    ) : (
                      <div className="p-2 border-t border-white/10">
                        <input
                          type="text"
                          className="w-full px-3 py-1.5 bg-black/50 border border-white/20 rounded-md text-sm text-white focus:border-blue-500 focus:outline-none"
                          placeholder="Organization Name"
                          value={newOrgName}
                          onChange={(e) => setNewOrgName(e.target.value)}
                          autoFocus
                        />
                        <div className="flex justify-end mt-2 gap-2">
                          <button
                            className="px-2 py-1 text-xs text-white/60 hover:text-white"
                            onClick={() => setIsAddingOrg(false)}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-2 py-1 text-xs bg-blue-500/80 text-white rounded-md hover:bg-blue-500"
                            onClick={handleAddNewOrg}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <ChevronRight className="w-4 h-4 text-blue-400" />

            {/* Chat Selector */}
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
                  {selectedChatTitle || "New Chat"}
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
