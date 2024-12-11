"use client"

import React, { useState } from 'react'
import { Artifact } from './App'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface ArtifactsPanelProps {
  artifacts: Artifact[]
  gitConnected: boolean
  onPushToGit: (artifact: Artifact) => void
}

const ArtifactsPanel: React.FC<ArtifactsPanelProps> = ({
  artifacts,
  gitConnected,
  onPushToGit,
}) => {
  const [editingArtifact, setEditingArtifact] = useState<string | null>(null)
  const [editedContent, setEditedContent] = useState<string>('')

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const handleDownload = (name: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleEdit = (name: string, content: string) => {
    setEditingArtifact(name)
    setEditedContent(content)
  }

  const handleSave = (name: string) => {
    const updatedArtifact = artifacts.find(a => a.name === name)
    if (updatedArtifact) {
      updatedArtifact.content = editedContent
      onPushToGit(updatedArtifact)
    }
    setEditingArtifact(null)
  }

  return (
    <ScrollArea className="h-screen">
      <div className="p-4 space-y-4">
        <h2 className="font-semibold text-lg">Generated Artifacts</h2>
        {artifacts.map((artifact) => (
          <Card key={artifact.name}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {artifact.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingArtifact === artifact.name ? (
                <div className="space-y-2">
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="font-mono text-sm"
                    rows={10}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSave(artifact.name)}
                      size="sm"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => setEditingArtifact(null)}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <pre className="bg-muted p-2 rounded-lg overflow-x-auto text-sm">
                    {artifact.content}
                  </pre>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleCopy(artifact.content)}
                      variant="outline"
                      size="sm"
                    >
                      Copy
                    </Button>
                    <Button
                      onClick={() => handleDownload(artifact.name, artifact.content)}
                      variant="outline"
                      size="sm"
                    >
                      Download
                    </Button>
                    <Button
                      onClick={() => handleEdit(artifact.name, artifact.content)}
                      variant="outline"
                      size="sm"
                    >
                      Edit
                    </Button>
                    {gitConnected && (
                      <Button
                        onClick={() => onPushToGit(artifact)}
                        size="sm"
                      >
                        Push to Git
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}

export default ArtifactsPanel

