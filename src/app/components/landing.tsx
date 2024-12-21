'use client'

import { ArrowRight } from 'lucide-react'
import { useState } from "react"
import { useChatState } from "../hooks/use-chat-state"
import { Input } from "./ui/input"
import { Button } from './ui/button'

export function Landing() {
  const setIsStarted = useChatState((state: any) => state.setIsStarted)
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      setIsStarted(true)
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-8">
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-bold text-white">
          What do you want to build?
        </h1>
        <p className="text-lg text-neutral-400">
          Prompt, run, edit, and deploy full-stack web apps.
        </p>
      </div>

      <div className="w-full max-w-xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="build a react app"
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
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-neutral-800 rounded border border-neutral-700">Shift</kbd>
          <span>+</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-neutral-800 rounded border border-neutral-700">Return</kbd>
          <span>for a new line</span>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {[
            "Start a blog with Astro",
            "Build a mobile app with NativeScript",
            "Create a docs site with Vitepress",
            "Scaffold UI with shadcn",
            "Draft a presentation with Slidev",
            "Code a video with Remotion"
          ].map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              className="text-sm border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white hover:bg-neutral-800"
              onClick={() => {
                setInput(suggestion)
                setIsStarted(true)
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
            {["Next.js", "Vite", "Nuxt", "Nest", "Astro", "Solid", "Vue"].map((framework) => (
              <Button
                key={framework}
                variant="ghost"
                className="h-12 w-12 rounded-full bg-neutral-900/50 hover:bg-neutral-800"
                onClick={() => {
                  setInput(`Create a new ${framework} app`)
                  setIsStarted(true)
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
    </div>
  )
}

