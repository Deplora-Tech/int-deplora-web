import type { GraphType, LoraStatus } from "../constants/Enums";

export type Message = {
  id: string;
  content: string;
  sender: "User" | "Deplora";
  timestamp: Date;
  userId: number;
  state?: LoraStatus[];
  type?: "secure" | "standard";
  fields?: string[];
};

export interface MessageContextType {
  messages: Message[];
  addMessage: (message: Omit<Message, "id">) => void;
  updateMessageStatus: (status: LoraStatus) => void;
  statusMap: Record<string, LoraStatus[]>;
  currentMessageId: string | null;
  fileContent: Record<string, string>;
  setFileContent: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  loraStatus?: LoraStatus;
  statuses: LoraStatus[];
  setMessageHistory: () => void;
  graph: GraphType | null;
}
