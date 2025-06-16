
import { useState } from "react";

export interface DeepSeekMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface UseDeepSeekAssistantResult {
  loading: boolean;
  error: string | null;
  reply: string | null;
  sendPrompt: (messages: DeepSeekMessage[], options?: { model?: string }) => Promise<void>;
}

export const useDeepSeekAssistant = (): UseDeepSeekAssistantResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reply, setReply] = useState<string | null>(null);

  const sendPrompt = async (
    messages: DeepSeekMessage[],
    options: { model?: string } = {}
  ) => {
    setLoading(true);
    setError(null);
    setReply(null);

    try {
      const res = await fetch("/functions/v1/deepseek-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: options.model ?? "deepseek-chat",
          messages,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Échec de la requête DeepSeek");
      }

      setReply(data.choices?.[0]?.message?.content ?? data.generatedText ?? JSON.stringify(data));
    } catch (err: any) {
      setError(err?.message || "Erreur inconnue avec DeepSeek AI");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, reply, sendPrompt };
};
