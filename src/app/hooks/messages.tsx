import React, { createContext, useContext, useState } from "react";

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
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "Deplora",
      content:
        "Hello! I'm Deplora, ready to help you with any software deployment tasks, questions, or technical challenges you have. What would you like to work on?",
      timestamp: new Date(),
      userId: 1,
    },
    {
      id: 2,
      sender: "User",
      content:
        "I'm trying to deploy a new React application. Can you help me with that?",
      timestamp: new Date(),
      userId: 1,
    },
  ]);

  const addMessage = (message: Omit<Message, "id">) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: prevMessages.length + 1, ...message }, // Auto-generate IDs
    ]);
  };

  return (
    <MessageContext.Provider value={{ messages, addMessage }}>
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
