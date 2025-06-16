
import React, { useState } from "react";
import { useDeepSeekAssistant, DeepSeekMessage } from "@/hooks/useDeepSeekAssistant";
import { Button } from "@/components/ui/button";

export const AIAssistantPanel = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<DeepSeekMessage[]>([
    {
      role: "system" as const,
      content:
        "Vous êtes un assistant pédagogique qui aide les enseignants à générer des cours, leçons et évaluations dans un style bienveillant, exhaustif et pédagogique, en français.",
    },
  ]);

  const { loading, error, reply, sendPrompt } = useDeepSeekAssistant();

  const handleSend = async () => {
    if (!input.trim()) return;
    const updatedMessages: DeepSeekMessage[] = [
      ...messages,
      { role: "user", content: input.trim() },
    ];
    setMessages(updatedMessages);
    setInput("");
    await sendPrompt(updatedMessages);
  };

  return (
    <div className="rounded-2xl glass border border-white/20 p-6 space-y-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-2">Assistant IA Enseignant DeepSeek</h2>
      <textarea
        className="w-full p-2 border rounded resize-none min-h-[80px]"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={loading}
        placeholder="Décrivez votre ressource, cours ou évaluation souhaité..."
      />
      <div className="flex justify-end">
        <Button onClick={handleSend} disabled={loading || !input.trim()}>
          {loading ? "Génération..." : "Générer avec l'IA"}
        </Button>
      </div>
      {reply && (
        <div className="mt-4 bg-slate-50 rounded p-3 border border-slate-200 text-slate-900 whitespace-pre-line">
          <b>Réponse IA:</b>
          <div className="mt-1">{reply}</div>
        </div>
      )}
      {error && (
        <div className="text-red-500 mt-2 text-sm">
          Erreur: {error}
        </div>
      )}
    </div>
  );
};
