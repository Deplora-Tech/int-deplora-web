import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { sendMessage, load_conv } from "../api/api";
import {
  LoraStatus,
  ExcecutionStatus,
  GraphStatus,
  GraphType,
} from "../constants/Enums";
import type { Message, MessageContextType } from "../types/MessageTypes";
import { useSession } from "./session";

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [statusMap, setStatusMap] = useState<Record<string, LoraStatus[]>>({});
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [loraStatus, setLoraStatus] = useState<LoraStatus | undefined>();
  const [statuses, setStatuses] = useState<LoraStatus[]>([]);
  const websocketRef = useRef<WebSocket | null>(null);
  const [graph, setGraph] = useState<GraphType | null>(null);
  const { session_id, setSessionId } = useSession();

  useEffect(() => {
    if (!session_id) return;

    const websocket = new WebSocket(
      `${process.env.NEXT_PUBLIC_API_URL}/ws/${session_id}`
    );
    websocketRef.current = websocket;

    websocket.onopen = () => {
      console.log("WebSocket connection opened.");
    };

    websocket.onmessage = (event) => {
      const res = JSON.parse(event.data);

      if (Object.values(ExcecutionStatus).includes(res.status)) {
        console.log("Pipeline status:", res.data);
      }

      if (Object.values(LoraStatus).includes(res.status)) {
        setLoraStatus(res.status);
        setStatuses((prev) => [...prev, res.status]);
        console.log("Lora status:", res.status);
      }

      if (Object.values(GraphStatus).includes(res.status)) {
        console.log("Graph status:", res.data);
        const graph = JSON.parse(res.data);
        setGraph(graph);
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
  }, [session_id]);

  const addMessage = async (message: Omit<Message, "id">) => {
    if (!session_id) {
      console.error("Session ID not set.");
      setLoraStatus(LoraStatus.FAILED);
      setStatuses((prev) => [...prev, LoraStatus.FAILED]);
      return;
    }

    setLoraStatus(LoraStatus.STARTING);
    // reset statuses
    setStatuses([LoraStatus.STARTING]);
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

  const setMessageHistory = () => {
    if (!session_id) {
      return;
    }
    console.log("Setting message history for session:", session_id);

    load_conv(session_id).then(({ chat_history, current_plan }) => {
      const formattedMessages: Message[] = chat_history.map(
        (chat: { role: string; message: string }): Message => ({
          id: crypto.randomUUID(),
          content: chat.message,
          sender: chat.role === "You" ? "Deplora" : "User",
          timestamp: new Date(),
          userId: 1,
        })
      );

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
        statuses,
        setMessageHistory,
        graph,
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
