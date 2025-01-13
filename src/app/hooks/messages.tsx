import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { sendMessage, load_conv } from "../api/api";
import { v4 } from "uuid";

export enum LoraStatus {
  STARTING = "STARTING",
  INTENT_DETECTED = "INTENT_DETECTED",
  RETRIEVING_USER_PREFERENCES = "RETRIEVING_USER_PREFERENCES",
  RETRIEVING_PROJECT_DETAILS = "RETRIEVING_PROJECT_DETAILS",
  GENERATING_DEPLOYMENT_PLAN = "GENERATING_DEPLOYMENT_PLAN",
  GENERATED_DEPLOYMENT_PLAN = "GENERATED_DEPLOYMENT_PLAN",
  GATHERING_DATA = "GATHERING_DATA",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export const statusMessages: Record<LoraStatus, string> = {
  [LoraStatus.STARTING]: "Starting the process...",
  [LoraStatus.INTENT_DETECTED]: "Intent detected! Analyzing further...",
  [LoraStatus.RETRIEVING_USER_PREFERENCES]: "Retrieving user preferences...",
  [LoraStatus.RETRIEVING_PROJECT_DETAILS]: "Fetching project details...",
  [LoraStatus.GENERATING_DEPLOYMENT_PLAN]: "Generating the deployment plan...",
  [LoraStatus.GENERATED_DEPLOYMENT_PLAN]: "Deployment plan generated successfully!",
  [LoraStatus.GATHERING_DATA]: "Gathering additional data...",
  [LoraStatus.COMPLETED]: "Process completed successfully!",
  [LoraStatus.FAILED]: "Something went wrong. Please try again.",
};

type Message = {
  id: string;
  content: string;
  sender: "User" | "Deplora";
  timestamp: Date;
  userId: number;
};

interface MessageHistory {
  chat_history: { role: string; message: string }[];
  current_plan: Record<string, string>;
}

interface MessageContextType {
  messages: Message[];
  addMessage: (message: Omit<Message, "id">) => void;
  updateMessageStatus: (status: LoraStatus) => void;
  statusMap: Record<string, LoraStatus[]>;
  currentMessageId: string | null;
  fileContent: Record<string, string>;
  setFileContent: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  loraStatus?: LoraStatus;
  setMessageHistory: (session_id: string) => void;
  session_id: string; // Add session_id to the context type
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [statusMap, setStatusMap] = useState<Record<string, LoraStatus[]>>({});
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [loraStatus, setLoraStatus] = useState<LoraStatus | undefined>();
  const websocketRef = useRef<WebSocket | null>(null);
  const [session_id, setSessionId] = useState<string>(v4());

  console.log("Session ID:", session_id);

  useEffect(() => {
    const websocket = new WebSocket(`${process.env.NEXT_PUBLIC_API_URL}/ws/1`);
    websocketRef.current = websocket;

    websocket.onopen = () => {
      console.log("WebSocket connection opened.");
    };

    websocket.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);

      if (event.data in LoraStatus) {
        setLoraStatus(event.data);
        updateMessageStatus(event.data);
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
    console.log("Updating message status:", status);
    setStatusMap((prev) => {
      const currentStatuses = prev[currentMessageId] || [];
      return {
        ...prev,
        [currentMessageId]: [...currentStatuses, status],
      };
    });
    console.log("Status map:", statusMap);

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
        session_id, // Include session_id in the context value
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
