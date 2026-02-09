// app/api/generate/route.ts
import { getPrompt } from "@/app/json-render/getPrompt";
import { streamText } from "ai";
import PROMPT from "../../json-render/PROMPT.json" assert { type: "json" };

export async function GET() {
  const systemPrompt = getPrompt();

  console.log("systemPrompt:", systemPrompt);

  const result = streamText({
    model: "anthropic/claude-haiku-4.5",
    system: systemPrompt,
    prompt: PROMPT,
  });

  return new Response(result.textStream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
