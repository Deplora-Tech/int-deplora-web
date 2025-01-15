import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { sendMessage, load_conv } from "../api/api";
import { v4 } from "uuid";
import { LoraStatus, ExcecutionStatus } from "../constants/Enums";
import type { Message, MessageContextType } from "../types/MessageTypes";

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [statusMap, setStatusMap] = useState<Record<string, LoraStatus[]>>({});
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [loraStatus, setLoraStatus] = useState<LoraStatus | undefined>();
  const [session_id, setSessionId] = useState<string>(v4());
  const websocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const websocket = new WebSocket(`${process.env.NEXT_PUBLIC_API_URL}/ws/1`);
    websocketRef.current = websocket;

    websocket.onopen = () => {
      console.log("WebSocket connection opened.");
    };

    websocket.onmessage = (event) => {
      const res = JSON.parse(event.data);

      if (Object.values(ExcecutionStatus).includes(res.status)) {
        console.log("Graph status:", res.data);
      }

      if (Object.values(LoraStatus).includes(res.status)) {
        setLoraStatus(res.status);
      }
    };

    websocket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      websocket.close();
    };
  }, []);

  const addMessage = async (message: Omit<Message, "id">) => {
    setLoraStatus(LoraStatus.STARTING);
    const id = crypto.randomUUID();
    setMessages((prev) => [...prev, { ...message, id }]);
    setStatusMap((prev) => ({ ...prev, [id]: [LoraStatus.STARTING] }));
    setCurrentMessageId(id);

    try {
      const reply = await sendMessage({
        message: message.content,
        client_id: "1",
        project_id: "1",
        organization_id: "1",
        session_id: session_id,
      });

      const messageContent = reply.processed_message.response;
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "Deplora",
          content: messageContent,
          timestamp: new Date(),
          userId: 1,
        },
      ]);

      const fileContents = reply.processed_message.file_contents;
      if (fileContents && Object.entries(fileContents).length > 0) {
        setFileContent(fileContents);
      }

      updateMessageStatus(LoraStatus.COMPLETED);
    } catch (error) {
      console.error("Error sending message:", error);
      updateMessageStatus(LoraStatus.FAILED);
    }
  };

  const updateMessageStatus = (status: LoraStatus) => {
    if (!currentMessageId) return;
    setStatusMap((prev) => {
      const currentStatuses = prev[currentMessageId] || [];
      return {
        ...prev,
        [currentMessageId]: [...currentStatuses, status],
      };
    });

    if (status === LoraStatus.COMPLETED || status === LoraStatus.FAILED) {
      setCurrentMessageId(null);
    }
  };

  const setMessageHistory = (session_id: string) => {
    setSessionId(session_id);

    load_conv(session_id).then(({ chat_history, current_plan }) => {
      const formattedMessages: Message[] = chat_history.map((chat) => ({
        id: crypto.randomUUID(),
        content: chat.message,
        sender: chat.role === "You" ? "Deplora" : "User",
        timestamp: new Date(),
        userId: 1,
      }));

      setMessages(formattedMessages);
      setFileContent(current_plan);
    });
  };

  return (
    <MessageContext.Provider
      value={{
        messages,
        addMessage,
        updateMessageStatus,
        statusMap,
        currentMessageId,
        fileContent,
        setFileContent,
        loraStatus,
        setMessageHistory,
        session_id,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessages must be used within a MessageProvider");
  }
  return context;
};