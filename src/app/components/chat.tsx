"use client"

import { Avatar } from "@/app/components/ui/avatar"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { ArrowRight, Link2, Sparkles } from 'lucide-react'
import { useState } from 'react'

interface Message {
  isBot: boolean
  content: string
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      isBot: false,
      content: "hi"
    },
    {
      isBot: true,
      content: "Hello! I'm Deplora, ready to help you with any software deployment tasks, questions, or technical challenges you have. What would you like to work on?"
    }
  ])
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      setMessages([...messages, { isBot: false, content: input.trim() }])
      setInput('')
      setTimeout(() => {
        setMessages(msgs => [...msgs, { 
          isBot: true, 
          content: "I'll help you create a new React application using Vite, which provides a modern and fast development experience." 
        }])
      }, 1000)
    }
  }

  return (
    <div className="gradient-border flex flex-col min-w-[350px] max-w-[450px] h-full">
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {messages.map((message, index) => (
          <div key={index} className="flex gap-3 group">
            <Avatar className="w-8 h-8 rounded-full overflow-hidden border border-white/[0.05] shrink-0">
              <img 
                src={message.isBot ? "/placeholder.svg" : "/placeholder.svg"} 
                alt={message.isBot ? "Bot" : "User"} 
                className="object-cover"
              />
            </Avatar>
            <div className="flex-1">
              <div className={`rounded-lg px-4 py-3 ${message.isBot ? 'bg-white/[0.02]' : 'bg-white/[0.05]'}`}>
                <p className="text-sm text-neutral-200 leading-relaxed">{message.content}</p>
              </div>
              {message.isBot && (
                <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-neutral-500 hover:text-white">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-neutral-500 hover:text-white">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-white/[0.02] p-4">
        <div className="flex gap-2 mb-4">
          <Button size="sm" variant="outline" className="text-xs border-white/[0.05] bg-white/[0.02] text-neutral-400 hover:text-white hover:bg-white/[0.05]">
            <Link2 className="w-3 h-3 mr-1" />
            Attach
          </Button>
          <Button size="sm" variant="outline" className="text-xs border-white/[0.05] bg-white/[0.02] text-neutral-400 hover:text-white hover:bg-white/[0.05]">
            <Sparkles className="w-3 h-3 mr-1" />
            Suggest
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="relative">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Deplora..." 
            className="pr-12 bg-white/[0.02] border-white/[0.05] text-neutral-200 placeholder-neutral-500"
          />
          <Button 
            type="submit"
            size="icon" 
            className="absolute right-1 top-1 h-8 w-8 bg-blue-500 hover:bg-blue-600 text-white"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
        <div className="mt-2 flex items-center justify-center gap-1 text-xs text-neutral-500">
          <span>Use</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white/[0.02] rounded border border-white/[0.05]">Shift</kbd>
          <span>+</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white/[0.02] rounded border border-white/[0.05]">Return</kbd>
          <span>for a new line</span>
        </div>
      </div>
    </div>
  )
}

