"use client";

import React, { useState, useRef } from "react";
import { Paperclip, ArrowUp } from "lucide-react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Card,
  IconButton,
  ThemeProvider,
  createTheme,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Header from "./Header";
import ChatInterface from "./ChatInterface";
import ArtifactsPanel from "./ArtifactsPanel";
import { GitIntegration } from "./GitIntegration";

export interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

export interface Artifact {
  name: string;
  content: string;
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B3B3B3",
    },
  },
});

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [showArtifacts, setShowArtifacts] = useState(false);
  const [gitConnected, setGitConnected] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [input, setInput] = useState("");
  const [artifactPanelWidth, setArtifactPanelWidth] = useState(600);
  const [isGitDialogOpen, setGitDialogOpen] = useState(true);

  const isResizing = useRef(false);

  const addMessage = (text: string, sender: "user" | "bot") => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: Date.now(), text, sender },
    ]);
  };
  const handlePushToGit = (artifact: Artifact) => {
    setStatusMessage(`Pushing ${artifact.name} to Git repository...`);
    setTimeout(() => {
      setStatusMessage(`${artifact.name} pushed successfully.`);
    }, 1000);
  };
  const handleUserMessage = async (message: string) => {
    addMessage(message, "user");
    setTimeout(() => {
      addMessage(`You said: ${message}`, "bot");
    }, 1000);

    if (message.toLowerCase().includes("artifact")) {
      setShowArtifacts(true);
      setArtifacts([
        { name: "Dockerfile", content: "FROM python:3.9\n..." },
        { name: "KubernetesManifest", content: "apiVersion: apps/v1\n..." },
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleUserMessage(input);
      setInput("");
    }
  };

  const handleGitConnect = async (
    repoUrl: string,
    username: string,
    password: string
  ) => {
    setStatusMessage("Connecting to Git repository...");
    setTimeout(() => {
      setGitConnected(true);
      setGitDialogOpen(false);
      setStatusMessage("Git repository connected successfully.");
    }, 1000);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isResizing.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing.current) {
      setArtifactPanelWidth((prevWidth) =>
        Math.max(
          200,
          Math.min(window.innerWidth - 100, prevWidth - e.movementX)
        )
      );
    }
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        display="flex"
        flexDirection="column"
        height="100vh"
        bgcolor="background.default"
        overflow="auto"
      >
        {/* Header */}
        <Header gitConnected={gitConnected} />

        {/* Git Integration Dialog */}
        <Dialog
          open={isGitDialogOpen}
          onClose={() => {}}
          disableEscapeKeyDown
          sx={{
            "& .MuiPaper-root": {
              backgroundColor: "background.paper",
              padding: 2,
              borderRadius: 2,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
              width: "600px",
              margin: "auto",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "text.primary",
              textAlign: "center",
            }}
          >
            Connect to Git Repository
          </DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              color: "text.secondary",
            }}
          >
            <GitIntegration onConnect={handleGitConnect} />
          </DialogContent>
        </Dialog>

        <Box component="main" flex={1} display="flex" mt={8} height="80vh">
          {/* Chat Interface */}
          <Box
            flex={1}
            display="flex"
            flexDirection="column"
            maxWidth="1024px"
            maxHeight="90vh"
            mx="auto"
            px={2}
            gap={2}
          >
            {messages.length === 0 ? (
              <Box
                flex={1}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                gap={2}
              >
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  color="text.primary"
                  gutterBottom
                >
                  What can I help you deploy?
                </Typography>
                <Box display="flex" gap={2}>
                  <Button variant="outlined" color="primary" size="small">
                    Generate a Dockerfile
                  </Button>
                  <Button variant="outlined" color="primary" size="small">
                    Setup Kubernetes manifests
                  </Button>
                  <Button variant="outlined" color="primary" size="small">
                    Configure CI/CD pipeline
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box
                flex={1}
                sx={{
                  overflowY: "auto",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                <ChatInterface messages={messages} />
              </Box>
            )}
            <form onSubmit={handleSubmit}>
              <Box position="relative" display="flex" alignItems="center">
                <TextField
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about deployment configurations..."
                  multiline
                  fullWidth
                  rows={4}
                  variant="outlined"
                  sx={{
                    backgroundColor: "background.paper",
                    color: "text.primary",
                  }}
                />
                <Box
                  position="absolute"
                  right={16}
                  bottom={16}
                  display="flex"
                  gap={1}
                >
                  <IconButton>
                    <Paperclip color="#FFFFFF" />
                  </IconButton>
                  <IconButton type="submit">
                    <ArrowUp color="#FFFFFF" />
                  </IconButton>
                </Box>
              </Box>
            </form>
          </Box>

          {/* Artifact Panel */}
          {showArtifacts && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "90vh",
                overflow: "hidden",
                width: artifactPanelWidth,
                transition: "width 0.2s ease",
                backgroundColor: "background.paper",
                borderLeft: "1px solid #333",
                position: "relative",
                minWidth: 400,
              }}
            >
              <Card
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 0,
                  backgroundColor: "background.paper",
                }}
              >
                <ArtifactsPanel
                  artifacts={artifacts}
                  gitConnected={gitConnected}
                  onPushToGit={handlePushToGit}
                />
              </Card>
              <Box
                onMouseDown={handleMouseDown}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: -5,
                  width: 10,
                  height: "100%",
                  cursor: "col-resize",
                  zIndex: 2,
                  backgroundColor: "transparent",
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
