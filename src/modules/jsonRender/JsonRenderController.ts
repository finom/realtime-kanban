import { getPrompt } from "@/app/json-render/getPrompt";
import { streamText } from "ai";
import PROMPT from "../../app/json-render/PROMPT.json" assert { type: "json" };
import { post, JSONLinesResponder, VovkRequest, procedure } from "vovk";
import {
  ChunkComponentElement,
  ChunkComponentList,
} from "@/app/json-render/types";
import z from "zod";

export default class JsonRenderController {
  @post("/stream")
  static render = procedure({ 
    body: z.object({
      prompt: z.string()
    }),
    handle: async (req) => {
    const system = getPrompt();
    const { prompt } = await req.json();

    console.log("systemPrompt:", system);

    const result = streamText({
      model: "anthropic/claude-opus-4.6",
      system,
      prompt,
    });

    return new Response(result.textStream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    }) as unknown as JSONLinesResponder<
      ChunkComponentElement | ChunkComponentList
    >;
}
  });
}
