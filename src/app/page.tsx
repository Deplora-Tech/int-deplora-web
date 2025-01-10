"use client";

import { useEffect, useState } from "react";
import { Chat } from "./components/chat";
import { CodeEditor } from "./components/CodeEditor/CodeEditor";
import { Landing, LandingChat } from "./components/landing";
import { ResizablePanel } from "./components/resizable-panel";
import { LoraStatus, useMessages } from "./hooks/messages";

export default function Home() {
  const { loraStatus, fileContent } = useMessages();
  const [hasFiles, setHasFiles] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);


  useEffect(() => {
    if (loraStatus === LoraStatus.STARTING) {
      setIsChatOpen(true);
    }
  }, [loraStatus]);

  useEffect(() => {
    if (Object.keys(fileContent).length > 0) {
      setHasFiles(true);
    }
  }, [fileContent]);

  if (isChatOpen && !hasFiles) {
    return <LandingChat />;
  }

  if (!hasFiles) {
    return <Landing />;
  }

  return (
    <div className="flex-1 flex min-h-0 p-4">
      <ResizablePanel>
        <Chat />
      </ResizablePanel>
      <CodeEditor />
    </div>
  );
}
