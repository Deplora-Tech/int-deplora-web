"use client"

import React from 'react'
import { Message } from './App'
import { cn } from "@/lib/utils"

interface ChatInterfaceProps {
  messages: Message[]
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages }) => {
  return (
    <div className="space-y-4 py-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
            message.sender === 'user' 
              ? "ml-auto bg-primary text-primary-foreground" 
              : "bg-muted"
          )}
        >
          {message.text}
        </div>
      ))}
    </div>
  )
}

export default ChatInterface

