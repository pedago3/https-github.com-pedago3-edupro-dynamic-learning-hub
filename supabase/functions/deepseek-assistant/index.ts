
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const apiKey = Deno.env.get("DEEPSEEK_API_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      model = "deepseek-chat",
      messages,
      stream = false,
      ...other
    } = body;

    const upstreamRes = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages,
        stream,
        ...other,
      }),
    });

    const contentType = upstreamRes.headers.get("content-type") ?? "application/json";
    const clonedHeaders = { ...corsHeaders, "Content-Type": contentType };

    // If streaming, just pipe the response
    if (stream && upstreamRes.body) {
      return new Response(upstreamRes.body, {
        status: upstreamRes.status,
        headers: clonedHeaders,
      });
    }

    const data = await upstreamRes.text();
    return new Response(data, {
      status: upstreamRes.status,
      headers: clonedHeaders,
    });
  } catch (error) {
    console.error("Error in deepseek-assistant:", error);
    return new Response(JSON.stringify({ error: error?.message || "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
