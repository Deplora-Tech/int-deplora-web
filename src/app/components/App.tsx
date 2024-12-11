"use client"

import React, { useState } from 'react'
import { Paperclip, ArrowUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import Header from './Header'
import ChatInterface from './ChatInterface'
import ArtifactsPanel from './ArtifactsPanel'
import GitIntegration from './GitIntegration'

export interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
}

export interface Artifact {
  name: string
  content: string
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [showArtifacts, setShowArtifacts] = useState(false)
  const [gitConnected, setGitConnected] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [input, setInput] = useState('')

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    setMessages(prevMessages => [...prevMessages, { id: Date.now(), text, sender }])
  }

  const handleUserMessage = async (message: string) => {
    addMessage(message, 'user')
    // Simulate bot response
    setTimeout(() => {
      addMessage(`You said: ${message}`, 'bot')
    }, 1000)

    if (message.toLowerCase().includes('artifact')) {
      setShowArtifacts(true)
      setArtifacts([
        { name: 'Dockerfile', content: 'FROM python:3.9\n...' },
        { name: 'KubernetesManifest', content: 'apiVersion: apps/v1\n...' },
      ])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      handleUserMessage(input)
      setInput('')
    }
  }

  const handleGitConnect = async (repoUrl: string, username: string, password: string) => {
    setStatusMessage('Connecting to Git repository...')
    setTimeout(() => {
      setGitConnected(true)
      setStatusMessage('Git repository connected successfully.')
    }, 1000)
  }

  const handlePushToGit = async (artifact: Artifact) => {
    setStatusMessage('Pushing artifact to Git...')
    setTimeout(() => {
      setStatusMessage('Artifact pushed to Git successfully.')
    }, 1000)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex">
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 gap-4">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center flex-col gap-4">
              <h1 className="text-4xl font-bold tracking-tight">
                What can I help you deploy?
              </h1>
              <div className="flex gap-2">
                <Button variant="secondary" className="text-sm">
                  Generate a Dockerfile
                </Button>
                <Button variant="secondary" className="text-sm">
                  Setup Kubernetes manifests
                </Button>
                <Button variant="secondary" className="text-sm">
                  Configure CI/CD pipeline
                </Button>
              </div>
            </div>
          ) : (
            <ScrollArea className="flex-1">
              <ChatInterface messages={messages} />
            </ScrollArea>
          )}
          <form onSubmit={handleSubmit} className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about deployment configurations..."
              className="min-h-[100px] resize-none pr-20"
            />
            <div className="absolute right-4 bottom-4 flex gap-2">
              <Button type="button" size="icon" variant="ghost">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button type="submit" size="icon">
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
        {showArtifacts && (
          <Card className="w-[400px] border-l rounded-none h-screen">
            <ArtifactsPanel
              artifacts={artifacts}
              gitConnected={gitConnected}
              onPushToGit={handlePushToGit}
            />
            {!gitConnected && (
              <GitIntegration onConnect={handleGitConnect} />
            )}
          </Card>
        )}
      </main>
      {statusMessage && (
        <div className="fixed bottom-4 right-4">
          <Card className="p-4 bg-muted">
            <p className="text-sm">{statusMessage}</p>
          </Card>
        </div>
      )}
    </div>
  )
}

export default App

