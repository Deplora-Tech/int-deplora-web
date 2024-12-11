"use client"

import React, { useState } from "react"
import { Artifact } from "./App"
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Box,
} from "@mui/material"

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
  const [editedContent, setEditedContent] = useState<string>("")

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const handleDownload = (name: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
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
    const updatedArtifact = artifacts.find((a) => a.name === name)
    if (updatedArtifact) {
      updatedArtifact.content = editedContent
      onPushToGit(updatedArtifact)
    }
    setEditingArtifact(null)
  }

  return (
    <Box sx={{ overflowY: "auto", height: "90vh", padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Generated Artifacts
      </Typography>
      {artifacts.map((artifact) => (
        <Card key={artifact.name} sx={{ marginBottom: 2 }}>
          <CardHeader
            title={<Typography variant="subtitle1">{artifact.name}</Typography>}
          />
          <CardContent>
            {editingArtifact === artifact.name ? (
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  multiline
                  rows={10}
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  variant="outlined"
                  fullWidth
                />
                <Box display="flex" gap={1}>
                  <Button variant="contained" size="small" onClick={() => handleSave(artifact.name)}>
                    Save
                  </Button>
                  <Button variant="outlined" size="small" onClick={() => setEditingArtifact(null)}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box display="flex" flexDirection="column" gap={2}>
                <Box
                  component="pre"
                  sx={{
                    backgroundColor: "action.hover",
                    padding: 2,
                    borderRadius: 1,
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                    overflowX: "auto",
                  }}
                >
                  {artifact.content}
                </Box>
                <CardActions sx={{ display: "flex", gap: 1 }}>
                  <Button variant="outlined" size="small" onClick={() => handleCopy(artifact.content)}>
                    Copy
                  </Button>
                  <Button variant="outlined" size="small" onClick={() => handleDownload(artifact.name, artifact.content)}>
                    Download
                  </Button>
                  <Button variant="outlined" size="small" onClick={() => handleEdit(artifact.name, artifact.content)}>
                    Edit
                  </Button>
                  {gitConnected && (
                    <Button variant="contained" size="small" onClick={() => onPushToGit(artifact)}>
                      Push to Git
                    </Button>
                  )}
                </CardActions>
              </Box>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}

export default ArtifactsPanel
