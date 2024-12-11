"use client"

import React, { useState } from "react"
import {
  Button,
  TextField,
  CardContent,
  Box,
  Typography,
} from "@mui/material"

interface GitIntegrationProps {
  onConnect: (repoUrl: string, username: string, password: string) => void
}
export const GitIntegration: React.FC<GitIntegrationProps> = ({ onConnect }) => {
  const [repoUrl, setRepoUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect(repoUrl, username, password);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <TextField
        id="repoUrl"
        label="Repository URL"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        placeholder="https://github.com/username/repo.git"
        variant="outlined"
        fullWidth
        required
        sx={{
          "& .MuiInputBase-root": {
            backgroundColor: "background.default",
            borderRadius: 1,
          },
        }}
      />
      <TextField
        id="username"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        variant="outlined"
        fullWidth
        sx={{
          "& .MuiInputBase-root": {
            backgroundColor: "background.default",
            borderRadius: 1,
          },
        }}
      />
      <TextField
        id="password"
        label="Password/Token"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        variant="outlined"
        fullWidth
        sx={{
          "& .MuiInputBase-root": {
            backgroundColor: "background.default",
            borderRadius: 1,
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          "&:hover": {
            backgroundColor: "primary.dark",
          },
        }}
      >
        Connect Repository
      </Button>
    </Box>
  );
};
