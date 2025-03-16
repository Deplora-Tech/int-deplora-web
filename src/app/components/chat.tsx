"use client";

import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  ArrowDown,
  ArrowRight,
  CircleStop,
  Link2,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMessages } from "../hooks/messages";
import { LoraStatus } from "../constants/Enums";
import AnimatedStatus from "./animated-status";

export function Chat() {
  const { messages, addMessage, loraStatus } = useMessages();
  const [input, setInput] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const isLoraActive =
    loraStatus &&
    loraStatus !== LoraStatus.COMPLETED &&
    loraStatus !== LoraStatus.FAILED;
  const handleScrollToBottom = () => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      setShowScrollButton(scrollHeight - scrollTop > clientHeight + 10);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      handleScroll();
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0 || loraStatus !== undefined) {
      handleScrollToBottom();
    }
  }, [messages.length, loraStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setTimeout(() => {
        addMessage({
          content: input,
          sender: "User",
          timestamp: new Date(),
          userId: 1,
        });
      }, 1000);
      setInput("");
    }
  };

  return (
    <div className="gradient-border flex flex-col min-w-[350px] max-w-[450px] h-full max-h-[90vh] rounded-lg border border-white/[0.05] relative ">
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
      >
        {messages.map((message, index) => (
          <div className="flex-col gap-1" key={index}>
            <div key={index} className="flex-col gap-3 group pb-3 ">
              <div className="flex items-center gap-2">
                {message.sender === "User" && (
                  <Avatar className="w-8 h-8 rounded-full overflow-hidden border border-white/[0.05] shrink-0">
                    <img
                      src={"/userlogo.svg"}
                      alt={"User"}
                      className="object-cover"
                    />
                  </Avatar>
                )}
                <div className="flex-1">
                  <div
                    className={`rounded-lg px-4 py-3 ${
                      message.sender === "Deplora"
                        ? "bg-gray-900/20"
                        : "bg-white/[0.05]"
                    }`}
                  >
                    <p className="text-sm text-gray-400 leading-relaxed font-medium">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
              {index === messages.length - 1 && loraStatus && (
                <div className="mt-2">
                  <AnimatedStatus />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showScrollButton && (
        <button
          className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg z-10 opacity-60 hover:opacity-100 transition-opacity"
          onClick={handleScrollToBottom}
          style={{
            bottom: "12%",
          }}
        >
          <ArrowDown className="w-3 h-3" />
        </button>
      )}

      <div className="m-2 rounded-[5px] border-t border-transparent bg-gradient-to-r from-blue-500 via-teal-400 to-transparent">
        <div className="bg-[#0a0a0a] rounded-[5px] p-3">
          <form onSubmit={handleSubmit} className="relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here"
              className="w-full h-14 pl-4 pr-20 bg-neutral-900/50 border-neutral-800 text-white placeholder-neutral-400"
            />
            <Button
              type="submit"
              size="icon"
              style={{
                display: input.length > 0 || isLoraActive ? "flex" : "none",
              }}
              className={`absolute right-2 top-2 h-10 w-10 bg-blue-500 hover:bg-blue-600 text-white`}
            >
              {isLoraActive ? (
                <CircleStop className="h-5 w-5" />
              ) : (
                <ArrowRight className="h-5 w-5" />
              )}
            </Button>
          </form>
          <div className="flex gap-2 mt-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-neutral-400 hover:text-white hover:bg-[#2C2C2C]"
            >
              <Link2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-neutral-400 hover:text-white hover:bg-[#2C2C2C]"
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
