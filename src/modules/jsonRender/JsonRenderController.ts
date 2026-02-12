import { getPrompt } from "@/app/json-render/getPrompt";
import { streamText } from "ai";
import { post, JSONLinesResponder, procedure } from "vovk";
import {
  ChunkComponentElement,
  ChunkComponentList,
} from "@/app/json-render/types";
import z from "zod";

export default class JsonRenderController {
  @post("ui")
  static render = procedure({
    body: z.object({
      editElementId: z.string().optional(),
      prompt: z.string(),
    }),
    handle: async (req) => {
      const system = getPrompt();
      const { prompt, editElementId } = await req.json();

      // console.log("systemPrompt:", system);

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
    },
  });
}
