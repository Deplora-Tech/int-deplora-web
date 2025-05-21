"use client";

import { ReactNode } from "react";
import { MessageProvider } from "./hooks/messages";
import { PipelineProvider } from "./hooks/pipeline";
import { SessionProvider } from "./hooks/session";
import { UserProvider } from "./hooks/user";
import { OrganizationProvider } from "./hooks/organizations";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <SessionProvider>
        <OrganizationProvider>
          <MessageProvider>
            <PipelineProvider>{children}</PipelineProvider>
          </MessageProvider>
        </OrganizationProvider>
      </SessionProvider>
    </UserProvider>
  );
}
