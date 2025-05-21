"use client";

import { ReactNode } from "react";
import { MessageProvider } from "./hooks/messages";
import { PipelineProvider } from "./hooks/pipeline";
import { SessionProvider } from "./hooks/session";
import { UserProvider } from "./hooks/user";
import { ProjectProvider } from "./hooks/projects";

/**
 * Centralized providers component that wraps the application with all necessary context providers
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <SessionProvider>
        <ProjectProvider>
          <MessageProvider>
            <PipelineProvider>{children}</PipelineProvider>
          </MessageProvider>
        </ProjectProvider>
      </SessionProvider>
    </UserProvider>
  );
}
