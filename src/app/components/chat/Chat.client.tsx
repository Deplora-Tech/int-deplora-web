"use client";

/*
 * @ts-nocheck
 * Preventing TS checks with files presented in the video for a better presentation.
 */

import { useState, useEffect, useRef, useCallback, memo } from "react";
import { toast, ToastContainer, cssTransition } from "react-toastify";
import { useAnimate } from "framer-motion";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import { BaseChat } from "./BaseChat";

// Toast animations
const toastAnimation = cssTransition({
  enter: "animated fadeInRight",
  exit: "animated fadeOutRight",
});

// Chat Component
export function Chat() {
  const [ready, setReady] = useState(true); // Placeholder for readiness
  const [initialMessages] = useState([]); // Placeholder for messages
  const title = "Chat Title"; // Placeholder for description title

  return (
    <>
      {ready && (
        <ChatImpl
          description={title}
          initialMessages={initialMessages}
          exportChat={() => console.log("Exporting chat...")}
          storeMessageHistory={(messages) => Promise.resolve(console.log(messages))}
          importChat={() => Promise.resolve()}
        />
      )}

      <ToastContainer
        closeButton={({ closeToast }) => (
          <button className="Toastify__close-button" onClick={closeToast}>
            <div className="i-ph:x text-lg" />
          </button>
        )}
        icon={({ type }) => {
          switch (type) {
            case "success":
              return <div className="i-ph:check-bold text-bolt-elements-icon-success text-2xl" />;
            case "error":
              return <div className="i-ph:warning-circle-bold text-bolt-elements-icon-error text-2xl" />;
          }
          return undefined;
        }}
        position="bottom-right"
        pauseOnFocusLoss
        transition={toastAnimation}
      />
    </>
  );
}

interface ChatProps {
  initialMessages: any[];
  storeMessageHistory: (messages: any[]) => Promise<void>;
  importChat: () => Promise<void>;
  exportChat: () => void;
  description?: string;
}

export const ChatImpl = memo(function ChatImpl({
  description,
  initialMessages,
  storeMessageHistory,
  importChat,
  exportChat,
}: ChatProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null as unknown as HTMLTextAreaElement);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [chatStarted, setChatStarted] = useState(initialMessages.length > 0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [imageDataList, setImageDataList] = useState<string[]>([]);
  const [searchParams] = useSearchParams();

  const [model, setModel] = useState(() => Cookies.get("selectedModel") || "default-model");
  const [provider, setProvider] = useState(() => Cookies.get("selectedProvider") || "default-provider");

  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [animationScope, animate] = useAnimate();

  const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 200;

  useEffect(() => {
    const prompt = ""
    if (prompt) {
      setInput(prompt);
      runAnimation();
      appendMessage(`[Model: ${model}]\n\n[Provider: ${provider}]\n\n${prompt}`);
    }
  }, [searchParams, model, provider]);

  useEffect(() => {
    const storedApiKeys = Cookies.get("apiKeys");
    if (storedApiKeys) {
      setApiKeys(JSON.parse(storedApiKeys));
    }
  }, []);

  const runAnimation = async () => {
    if (chatStarted) return;

    await Promise.all([
      animate("#examples", { opacity: 0, display: "none" }, { duration: 0.1 }),
      animate("#intro", { opacity: 0, flex: 1 }, { duration: 0.2 }),
    ]);

    setChatStarted(true);
  };

  const appendMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", content },
    ]);
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    appendMessage(`[Model: ${model}]\n\n[Provider: ${provider}]\n\n${input}`);
    setInput("");
    setUploadedFiles([]);
    setImageDataList([]);
    toast.success("Message sent!");
  };

  return (
    <BaseChat
      ref={animationScope}
      textareaRef={textareaRef}
      input={input}
      handleInputChange={(e) => setInput(e.target.value)}
      sendMessage={sendMessage}
      messages={messages}
      chatStarted={chatStarted}
      description={description}
      uploadedFiles={uploadedFiles}
      setUploadedFiles={setUploadedFiles}
      imageDataList={imageDataList}
      setImageDataList={setImageDataList}
    />
  );
});
