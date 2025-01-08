import axios from "axios";

type MessageRequestBody = {
  message: string;
  client_id: string;
  project_id: string;
  organization_id: string;
  session_id: string;
};

type ApiResponse = {
  status: string;
  processed_message: {
    status: string;
    response: any;
    folder_structure: Record<string, string>;
    file_contents: Record<string, string>;
  };
};

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const sendMessage = async (
  requestBody: MessageRequestBody
): Promise<ApiResponse> => {
  const response = await api.post("/send-message", {
    ...requestBody,
  });
  return response.data;
};

