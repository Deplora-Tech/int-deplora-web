"use client";

import { Chat } from "./components/chat";
import { CodeEditor } from "./components/CodeEditor/CodeEditor";
import { Landing } from "./components/landing";
import { ResizablePanel } from "./components/resizable-panel";
import { MessageProvider } from "./hooks/messages";
import { useChatState } from "./hooks/use-chat-state";

export default function Home() {
  const isStarted = useChatState((state: any) => state.isStarted);

  if (!isStarted) {
    return <Landing />;
  }

  return (
    <MessageProvider>
      <div className="flex-1 flex min-h-0">
        <ResizablePanel>
          <Chat />
        </ResizablePanel>
        <CodeEditor />
      </div>
    </MessageProvider>
  );
}
