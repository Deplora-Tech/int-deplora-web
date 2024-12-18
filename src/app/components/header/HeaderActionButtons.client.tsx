"use client";

import { useState } from "react";
import { Box, Button, Divider, IconButton, useMediaQuery } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CodeIcon from "@mui/icons-material/Code";

export function HeaderActionButtons() {
  const [showChat, setShowChat] = useState(true); // Simulating chat store
  const [showWorkbench, setShowWorkbench] = useState(false); // Simulating workbench store

  const isSmallViewport = useMediaQuery("(max-width:1024px)");

  const canHideChat = !showChat;

  return (
    <Box display="flex">
      {/* Action Buttons */}
      <Box
        display="flex"
        border={1}
        borderColor="grey.300"
        borderRadius={1}
        overflow="hidden"
      >
        {/* Chat Button */}
        <CustomButton
          active={showChat}
          disabled={!canHideChat || isSmallViewport}
          onClick={() => setShowChat(!showChat)}
        >
          <ChatIcon fontSize="small" />
        </CustomButton>

        <Divider orientation="vertical" flexItem />

        {/* Workbench Button */}
        <CustomButton
          active={showWorkbench}
          onClick={() => {
            if (showWorkbench && !showChat) {
              setShowChat(true);
            }
            setShowWorkbench(!showWorkbench);
          }}
        >
          <CodeIcon fontSize="small" />
        </CustomButton>
      </Box>
    </Box>
  );
}

// Custom Button Component
interface CustomButtonProps {
  active?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}

function CustomButton({
  active = false,
  disabled = false,
  children,
  onClick,
}: CustomButtonProps) {
  return (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      sx={{
        backgroundColor: active ? "primary.main" : "transparent",
        color: active ? "white" : "grey.600",
        "&:hover": {
          backgroundColor: active ? "primary.dark" : "grey.200",
        },
        padding: "8px",
      }}
    >
      {children}
    </IconButton>
  );
}
