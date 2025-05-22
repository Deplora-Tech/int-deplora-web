import type { GraphType, LoraStatus } from "../constants/Enums";

export type Message = {
  id: string;
  content: any;
  sender: "User" | "Deplora" | String;
  timestamp: Date;
  userId: number;
  state?: LoraStatus[];
  type?: "secure" | "standard";
  fields?: string[];
  variation?: "chat" | "pipeline" | undefined;
};

export type Chat = {
  session_id: string;
  title: string;
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
  allPipelineData: any;
  chatList: Chat[];
}
