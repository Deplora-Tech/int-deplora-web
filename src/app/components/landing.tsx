"use client";

import { ArrowDown, ArrowRight, CircleStop, Link } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMessages } from "../hooks/messages";
import { LoraStatus, statusMessages } from "../constants/Enums";
import { Avatar } from "./ui/avatar";
import { v4 } from "uuid";
import { LampContainer } from "./ui/lamp";
import { motion } from "framer-motion";

import { Popup } from "./popup"; // Import the Popup component
import { useSession } from "../hooks/session";

export function LandingChat() {
  const [input, setInput] = useState("");
  const { messages, addMessage, loraStatus } = useMessages();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const [showPopup, setShowPopup] = useState(false); // Popup state
  const { setSessionId, session_id , project_id, setProjectId} = useSession();
  const isLoraActive =
    loraStatus &&
    loraStatus !== LoraStatus.COMPLETED &&
    loraStatus !== LoraStatus.FAILED;

  
  useEffect(() => {
    if (!session_id) {
      const id = v4();
      setSessionId(id);
      console.log("Setting session id:", id);
    }
  }, []);


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
    if (!project_id) return; // Ensure a project is selected
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
    <div className="flex-1 flex flex-col items-center justify-center px-4  space-y-0 min-w-48">
      {messages.length === 0 && (
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-bold text-white">
            What do you want to build?
          </h1>
          <p className="text-lg text-neutral-400">
            Prompt, run, edit, and deploy full-stack web apps.
          </p>
          <Button
            variant="outline"
            className="group relative px-4 py-2 text-s bg-neutral-900/50 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-200 hover:text-white transition-all"
            onClick={() => setShowPopup(true)}
          >
            <span className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              Add Project
            </span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-xl" />
          </Button>
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
                  className={`flex-1 rounded-lg px-4 py-3 ${message.sender === "Deplora"
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
            className="absolute left-1/2 transform -tranneutral-x-1/2 tranneutral-y-1 bg-blue-500 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg opacity-60 hover:opacity-100 transition-opacity"
            onClick={handleScrollToBottom}
            style={{ bottom: "18%" }}
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        )}

        {isLoraActive ? (
          <div className="flex flex-col items-left mt-4 space-y-2">
            <div className="gradient-line h-1 w-full"></div>
            <div className="typing-animation text-white text-sm font-medium text-left gap-1">
              {statusMessages[loraStatus]}
            </div>
          </div>
        ) : null}

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
            style={{
              display: input.length > 0 ? "flex" : "none",
            }}
            disabled={!project_id} // Disable until a project is selected
            className={`absolute right-2 top-2 h-10 w-10 bg-blue-500 hover:bg-blue-600 text-white ${
              !project_id ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoraActive ? (
              <CircleStop className="h-5 w-5" />
            ) : (
              <ArrowRight className="h-5 w-5" />
            )}
          </Button>
        </form>

        {showPopup && (
          <Popup
            onClose={() => setShowPopup(false)}
            onRepoSelect={(repo) => {
              setProjectId(repo);
              setShowPopup(false);
            }}
            selectedRepo={project_id!}
          />
        )}

        <div className="mt-2 flex items-center justify-center gap-1 text-xs text-neutral-500">
          <span>Use</span>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-neutral-800 rounded border border-neutral-700">
            Shift
          </kbd>
          <span>+</span>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-neutral-800 rounded border border-neutral-700">
            Return
          </kbd>
          <span>for a new line</span>
        </div>
        {messages.length === 0 && (
          <div>
            <div className="mt-8 flex flex-wrap gap-2 justify-center">
              {[
                "Generate a Docker deployment plan",
                "Create a Kubernetes cluster setup",
                "Automate deployment with Terraform",
                "Set up CI/CD with Jenkins",
                "Configure AWS for scalable deployments",
                "Deploy a serverless app with AWS Lambda",
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
                or start by selecting a framework or deployment strategy
              </p>
              <div className="flex justify-center gap-5">
                {[
                  { name: "Docker", logo: "/logos/docker.svg" },
                  { name: "Kubernetes", logo: "/logos/kubernetes.svg" },
                  { name: "Terraform", logo: "/logos/terraform.svg" },
                  { name: "AWS", logo: "/logos/awslambda.svg" },
                  { name: "Azure", logo: "/logos/googlecloud.svg" },
                  { name: "GitHub Actions", logo: "/logos/githubactions.svg" },
                ].map((framework) => (
                  <Button
                    key={framework.name}
                    variant="ghost"
                    className="h-14 w-14 rounded-full bg-neutral-300 hover:bg-neutral-600"
                    onClick={() => {
                      setInput(`Plan a deployment using ${framework.name}`);
                    }}
                  >
                    <img
                      src={framework.logo}
                      alt={framework.name}
                      className="w-12 h-12" // Increased icon size
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

export function Landing() {
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-br from-neutral-300 to-neutral-500 py-4 bg-clip-text text-4xl font-medium min-w-48 "
      >
        <LandingChat />
      </motion.h1>
    </LampContainer>
  );
}
