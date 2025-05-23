import axios from "axios";
import { GitRepo } from "../types/SessionType";

type MessageRequestBody = {
  message: string;
  client_id: string;
  project: GitRepo;
  organization_id: string;
  session_id: string;
};

type GraphRequestBody = {
  id: string;
  file_contents: Record<string, string>;
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

type Organization = {
  id?: string;
  client_id: string;
  name: string;
  description: string;
  api_key?: string;
  secret_key?: string;
  environment_variables?: Record<string, string>;
  regions?: string[];
  deployment_settings?: {
    default_region?: string;
    auto_deploy?: boolean;
  };
};
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const apigraph = axios.create({
  baseURL: process.env.NEXT_GRAPH_GENERATE_URL,
});

export const sendMessage = async (
  requestBody: MessageRequestBody
): Promise<ApiResponse> => {
  console.log("Sending message:", JSON.stringify(requestBody));
  const response = await api.post("/send-message", {
    ...requestBody,
  });

  return response.data;
};

export const load_conv = async (session_id: string) => {
  const response = await api.get(`/get-chat-history/${session_id}`);
  console.log(response);
  return response.data;
};

export const getGraph = async (request: GraphRequestBody) => {
  const response = await apigraph.post("/generate/graph", request);
  console.log(response.data);
  return response.data;
};

export const getOrganizations = async (client_id: string) => {
  const response = await api.post(`/get-organizations/${client_id}`);
  console.log(response.data);
  return response.data;
};

export const createOrganization = async (organization: Organization) => {
  const response = await api.post("/create-organization", {
    ...organization,
  });

  return response.data;
};

export const updateOrganization = async (
  organizationId: string,
  updates: Partial<Organization>
) => {
  const response = await api.put(`/organizations/${organizationId}`, {
    ...updates,
  });

  return response.data;
};

export const getChatList = async (client_id: string | null) => {
  const response = await api.post(`/get-chat-list/${client_id}`);
  return response.data.chat_list;
};
