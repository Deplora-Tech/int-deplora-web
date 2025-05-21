"use client";

import { ArrowDown, ArrowRight, CircleStop } from "lucide-react";
import { useRef, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Avatar } from "../ui/avatar";
import { useMessages } from "../../hooks/messages";
import { LoraStatus, statusMessages } from "../../constants/Enums";
import { Popup } from "../popup";
import { useLandingState } from "../../hooks/use-landing";

export function LandingChat() {
  const {
    input,
    setInput,
    showScrollButton,
    setContainerElement,
    showPopup,
    setShowPopup,
    handleScrollToBottom,
    handleScroll,
  } = useLandingState();

  const { messages, addMessage, loraStatus } = useMessages();

  const isLoraActive =
    loraStatus &&
    loraStatus !== LoraStatus.COMPLETED &&
    loraStatus !== LoraStatus.FAILED;

  const containerRef = useRef<HTMLDivElement>(null);

  // Set container element for scroll management
  useEffect(() => {
    if (containerRef.current) {
      setContainerElement(containerRef.current);
    }
  }, [setContainerElement]);

  // Auto-scroll on new messages
  useEffect(() => {
    handleScrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 w-full max-w-5xl h-screen mx-auto pt-4 pb-12 px-4 relative">
      {/* Chat container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto"
        onScroll={handleScroll}
      >
        <div className="flex flex-col px-4 space-y-4 pb-10">
          {/* Initial greeting message */}
          <div className="flex gap-4 items-start">
            <Avatar className="mt-1">
              <div className="w-10 h-10 rounded-full border-2 border-white/10 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
            </Avatar>
            <div className="flex-1 bg-white/5 rounded-xl p-4 space-y-2">
              <p className="text-white/90">
                Welcome to Deplora! I can help you set up any infrastructure
                deployment you need. What type of deployment are you looking
                for?
              </p>
            </div>
          </div>

          {/* Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 items-start ${
                message.sender === "user" ? "justify-end" : ""
              }`}
            >
              {message.sender !== "user" && (
                <Avatar className="mt-1">
                  <div className="w-10 h-10 rounded-full border-2 border-white/10 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">AI</span>
                  </div>
                </Avatar>
              )}

              <div
                className={`flex-1 ${
                  message.sender === "User"
                    ? "bg-blue-600/20 text-right"
                    : "bg-white/5"
                } rounded-xl p-4 space-y-2 max-w-2xl`}
              >
                <p className="text-white/90">{message.content}</p>
              </div>

              {message.sender === "User" && (
                <Avatar className="mt-1">
                  <div className="w-10 h-10 rounded-full border-2 border-white/10 bg-slate-900 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">You</span>
                  </div>
                </Avatar>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isLoraActive && (
            <div className="flex gap-4 items-start">
              <Avatar className="mt-1">
                <div className="w-10 h-10 rounded-full border-2 border-white/10 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
              </Avatar>
              <div className="flex-1 bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="h-2 w-2 bg-blue-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                  <div className="h-2 w-2 bg-blue-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                  <div className="ml-2 text-sm text-blue-400">
                    {statusMessages[loraStatus as LoraStatus]}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          className="absolute bottom-24 right-8 p-2 bg-blue-500/80 text-white rounded-full shadow-lg hover:bg-blue-400 transition-all"
          onClick={handleScrollToBottom}
        >
          <ArrowDown className="h-5 w-5" />
        </button>
      )}

      {/* Input area */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex gap-2">
          <Input
            className="flex-1"
            placeholder="What deployment are you looking for? (e.g. Kubernetes, AWS Lambda)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                addMessage({
                  content: input,
                  sender: "User",
                  timestamp: new Date(),
                  userId: 1,
                });
              }
            }}
            disabled={isLoraActive}
          />
          <Button
            onClick={() =>
              addMessage({
                content: input,
                sender: "User",
                timestamp: new Date(),
                userId: 1,
              })
            }
            disabled={isLoraActive || !input.trim()}
            className={`group relative px-4 ${
              isLoraActive
                ? "bg-gray-700 text-gray-300"
                : "bg-blue-600 text-white"
            }`}
          >
            {isLoraActive ? (
              <CircleStop className="h-5 w-5" />
            ) : (
              <>
                <span className="relative z-10">Send</span>
                <ArrowRight className="relative z-10 ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Popup for missing information */}
      {showPopup && (
        <Popup
          onClose={() => setShowPopup(false)}
          onRepoSelect={() => {}}
          selectedRepo={""}
        />
      )}
    </div>
  );
}
