"use client";

import React, { useEffect, useRef, useState } from "react";
import { Message } from "./App";
import { cn } from "../lib/utils";
import { motion } from "framer-motion"; // For animations
import { Box } from "@mui/material";

interface ChatInterfaceProps {
  messages: Message[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Simulate bot typing
  useEffect(() => {
    if (
      messages.length > 0 &&
      messages[messages.length - 1].sender === "user"
    ) {
      setIsTyping(true);
      const timeout = setTimeout(() => setIsTyping(false), 1500);
      return () => clearTimeout(timeout);
    }
  }, [messages]);

  // Automatically scroll to the bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Box
      className="space-y-4 py-4 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-700"
      sx={{
        overflowY: "auto",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE
        "&::-webkit-scrollbar": {
          display: "none", // Chrome, Safari, Edge
        },
      }}
    >
      {messages.map((message) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "relative flex w-max max-w-[80%] flex-col gap-2 rounded-xl px-4 py-3 text-sm transition-transform duration-300 ease-in-out shadow-md",
            message.sender === "user"
              ? "ml-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
              : "bg-gradient-to-r from-gray-700 to-gray-800 text-gray-200"
          )}
        >
          {message.sender === "bot" && (
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-600">
              🤖
            </div>
          )}
          <p>{message.text}</p>
          <span className="text-xs text-gray-400 self-end">
            {new Date(message.id).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </motion.div>
      ))}

      {isTyping && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="flex items-center gap-2 px-4 py-3 bg-gray-700 text-gray-200 rounded-xl max-w-max"
        >
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
          <span>Typing...</span>
        </motion.div>
      )}

      {/* Spacer to scroll to the bottom */}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default ChatInterface;
