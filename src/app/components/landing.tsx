"use client";

import { ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMessages } from "../hooks/messages";
import { Avatar } from "./ui/avatar";

export function Landing() {
  const [input, setInput] = useState("");
  const { messages, addMessage } = useMessages();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      addMessage({
        content: input,
        sender: "User",
        timestamp: new Date(),
        userId: 1,
      });
      setInput("");
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-8">
      {messages.length === 0 && (
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-bold text-white">
            What do you want to build?
          </h1>
          <p className="text-lg text-neutral-400">
            Prompt, run, edit, and deploy full-stack web apps.
          </p>
        </div>
      )}
      <div className="w-full max-w-4xl mx-auto">
        {messages.length > 0 && (
          <div
            ref={containerRef}
            className="flex-1 overflow-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent max-h-[70vh] bg-neutral-900/50 rounded-lg"
          >
            {messages.map((message, index) => (
              <div key={index} className="flex gap-3">
                {message.sender === "User" && (
                  <Avatar className="w-8 h-8 rounded-full overflow-hidden border border-white/[0.05] shrink-0">
                    <img
                      src="/userlogo.svg"
                      alt="User"
                      className="object-cover"
                    />
                  </Avatar>
                )}
                <div
                  className={`flex-1 rounded-lg px-4 py-3 ${
                    message.sender === "Bot"
                      ? "bg-white/[0.02]"
                      : "bg-white/[0.05]"
                  }`}
                >
                  <p className="text-sm text-neutral-200 leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {showScrollButton && (
          <button
            className="absolute left-1/2 transform -translate-x-1/2 translate-y-1 bg-blue-500 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg opacity-60 hover:opacity-100 transition-opacity"
            onClick={handleScrollToBottom}
            style={{ bottom: "10%" }}
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        )}

        {/* Chat Input */}
        <form onSubmit={handleSubmit} className="relative mt-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here"
            className="w-full h-14 pl-4 pr-20 bg-neutral-900/50 border-neutral-800 text-white placeholder-neutral-400"
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-2 top-2 h-10 w-10 bg-blue-500 hover:bg-blue-600 text-white"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </form>
        <div className="mt-2 flex items-center justify-center gap-1 text-xs text-neutral-500">
          <span>Use</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-neutral-800 rounded border border-neutral-700">
            Shift
          </kbd>
          <span>+</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-neutral-800 rounded border border-neutral-700">
            Return
          </kbd>
          <span>for a new line</span>
        </div>
        {messages.length === 0 && (
          <div>
            <div className="mt-8 flex flex-wrap gap-2 justify-center">
              {[
                "Start a blog with Astro",
                "Build a mobile app with NativeScript",
                "Create a docs site with Vitepress",
                "Scaffold UI with shadcn",
                "Draft a presentation with Slidev",
                "Code a video with Remotion",
              ].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  className="text-sm border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white hover:bg-neutral-800"
                  onClick={() => {
                    setInput(suggestion);
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-neutral-500 mb-4">
                or start a blank app with your favorite stack
              </p>
              <div className="flex justify-center gap-4">
                {[
                  "Next.js",
                  "Vite",
                  "Nuxt",
                  "Nest",
                  "Astro",
                  "Solid",
                  "Vue",
                ].map((framework) => (
                  <Button
                    key={framework}
                    variant="ghost"
                    className="h-12 w-12 rounded-full bg-neutral-900/50 hover:bg-neutral-800"
                    onClick={() => {
                      setInput(`Create a new ${framework} app`);
                    }}
                  >
                    <img
                      src={`/placeholder.svg?text=${framework}`}
                      alt={framework}
                      className="w-6 h-6"
                    />
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
