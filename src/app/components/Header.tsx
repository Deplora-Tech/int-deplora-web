import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

interface HeaderProps {
  gitConnected?: boolean; // Optional prop to indicate Git connection status
}

const Header: React.FC<HeaderProps> = ({ gitConnected }) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        backgroundColor: "background.paper",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ minHeight: 56, paddingX: 2, gap: 2 }}>
        <Box flex={1}>
          <Typography variant="h6" fontWeight="bold">
            Deployment Assistant
          </Typography>
        </Box>
        {gitConnected && (
          <Button
            variant="outlined"
            size="small"
            sx={{
              color: "primary.main",
              borderColor: "primary.main",
            }}
          >
            Connected to Git
          </Button>
        )}
        <Button variant="outlined" size="small">
          Sign in
        </Button>
        <Button variant="contained" size="small">
          Sign up
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
