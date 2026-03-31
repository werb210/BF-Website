import { apiRequest, type ApiResult } from "@/lib/api";

type MayaChatResponse = {
  reply?: string;
  data?: {
    reply?: string;
  };
};

export async function sendMayaMessage(message: string): Promise<ApiResult<MayaChatResponse>> {
  return apiRequest<MayaChatResponse>("/maya/chat", {
    method: "POST",
    body: { message },
  });
}
