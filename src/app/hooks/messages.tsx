import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { sendMessage, load_conv, getChatList } from "../api/api";
import {
  LoraStatus,
  ExcecutionStatus,
  GraphStatus,
  GraphType,
} from "../constants/Enums";
import type { Chat, Message, MessageContextType } from "../types/MessageTypes";
import { useSession } from "./session";
import { GitRepo } from "../types/SessionType";

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [statusMap, setStatusMap] = useState<Record<string, LoraStatus[]>>({});
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<Record<string, string>>({});
  const [allPipelineData, setPipelineData] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loraStatus, setLoraStatus] = useState<LoraStatus | undefined>();
  const [statuses, setStatuses] = useState<LoraStatus[]>([]);
  const websocketRef = useRef<WebSocket | null>(null);
  const [graph, setGraph] = useState<GraphType | null>(null);
  const { session_id, client_id, project, setClientId, setProject } = useSession();
  const [chatList, setChatList] = useState<Chat[]>([]);

    useEffect(() => {
    setClientId("user1")
  }
  , []);


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
        updateMessageStatus(res.status);
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

  useEffect(() => {
    const getChatLst = async () => {
      const response = await getChatList("1");
      setChatList(response);
      console.log("Chat List:", response);
    };
    getChatLst();
  }, []);

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
    console.log("Current message ID Set to:", id);

    try {
      await sendMessage({
        message: message.content,
        client_id: client_id ?? "",
        project: project ?? {} as GitRepo,
        organization_id: "1",
        session_id: session_id,
      });

      // const messageContent = reply.processed_message.response;
      // setMessages((prev) => [
      //   ...prev,
      //   {
      //     id: crypto.randomUUID(),
      //     sender: "Deplora",
      //     content: messageContent,
      //     timestamp: new Date(),
      //     userId: 1,
      //     status: [],
      //   },
      // ]);

      // const fileContents = reply.processed_message.file_contents;
      // if (fileContents && Object.entries(fileContents).length > 0) {
      //   setFileContent(fileContents);
      // }

      setLoraStatus(undefined);
      setMessageHistory();
    } catch (error) {
      console.error("Error sending message:", error);
      updateMessageStatus(LoraStatus.FAILED);
      setLoraStatus(undefined);
      setMessageHistory();
    }
  };

  const updateMessageStatus = (status: LoraStatus) => {
    if (!currentMessageId) return;
    console.log("Updating message status:", status);
    console.log("Current message ID:", currentMessageId);
    setStatusMap((prev) => {
      const currentStatuses = prev[currentMessageId] || [];
      return {
        ...prev,
        [currentMessageId]: [...currentStatuses, status],
      };
    });
    console.log("Status map updated:", status);
    if (status === LoraStatus.COMPLETED || status === LoraStatus.FAILED) {
      console.log("Clearing current message ID.");
      setCurrentMessageId(null);
    }
  };

  const setMessageHistory = () => {
    if (!session_id) {
      return;
    }
    console.log("Setting message history for session:", session_id);

    load_conv(session_id).then(
      ({ chat_history, current_plan, pipeline_data, project_data }) => {
        const formattedMessages: Message[] = chat_history.map(
          (chat: {
            role: string;
            message: any;
            state: LoraStatus[];
          }): Message => ({
            id: crypto.randomUUID(),
            content: chat.message,
            sender: chat.role === "You" ? "Deplora" : chat.role,
            timestamp: new Date(),
            userId: 1,
            state: chat.state,
          })
        );
        console.log("Pipelines:", pipeline_data);
        setMessages(formattedMessages);
        setFileContent(current_plan);
        setPipelineData(pipeline_data);
        setProject(project_data);
      }
    );
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
        allPipelineData,
        chatList,
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
