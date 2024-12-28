import React, { createContext, useContext, useState } from "react";
import { sendMessage } from "../api/api";
import { FILE_CONTENT } from "../lib/editor";

type Message = {
  id: number;
  sender: string;
  content: string;
  timestamp: Date;
  userId: number;
};

interface MessageContextType {
  messages: Message[];
  addMessage: (message: Omit<Message, "id">) => void;
  fileContent: Record<string, string>;
  setFileContent: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [fileContent, setFileContent] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = async (message: Omit<Message, "id">) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: prevMessages.length + 1, ...message },
    ]);

    const reply = await sendMessage({
      message: message.content,
      client_id: "1",
      project_id: "1",
      organization_id: "1",
      session_id: "1",
      chat_history: {},
    });

    const messageContent = reply.processed_message.response;
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: prevMessages.length + 1,
        sender: "Deplora",
        content: messageContent,
        timestamp: new Date(),
        userId: 1,
      },
    ]);
    const fileContents = reply.processed_message.file_contents;
    if (fileContents) setFileContent(fileContents);
  };

  return (
    <MessageContext.Provider
      value={{ messages, addMessage, fileContent, setFileContent }}
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
