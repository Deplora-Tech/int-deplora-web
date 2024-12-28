"use client";

import { Chat } from "./components/chat";
import { CodeEditor } from "./components/CodeEditor/CodeEditor";
import { Landing } from "./components/landing";
import { ResizablePanel } from "./components/resizable-panel";
import { useMessages } from "./hooks/messages";

export default function Home() {
  const { messages, fileContent } = useMessages();

  if (Object.keys(fileContent).length === 0) {
    return <Landing />;
  }

  return (
    <div className="flex-1 flex min-h-0">
      <ResizablePanel>
        <Chat />
      </ResizablePanel>
      <CodeEditor />
    </div>
  );
}
