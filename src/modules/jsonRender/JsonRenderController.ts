import { getPrompt } from "@/app/json-render/getPrompt";
import { getClarifyPrompt } from "@/app/json-render/getClarifyPrompt";
import { getEditPrompt } from "@/app/json-render/getEditPrompt";
import { generateText, streamText } from "ai";
import { post, JSONLinesResponder, procedure } from "vovk";
import {
  ChunkComponent,
  ChunkComponentElement,
  ChunkComponentList,
} from "@/app/json-render/types";
import z from "zod";

export default class JsonRenderController {
  /**
   * Clarify a user's prompt before generation.
   * Returns a JSON object with the AI's clarification/summary.
   */
  @post("ui/clarify")
  static clarify = procedure({
    body: z.object({
      existingLines: z.any().array().optional(),
      previousPrompt: z.string().optional(),
      prompt: z.string(),
    }),
    output: z.object({ text: z.string() }),
  }).handle(async ({ vovk }) => {
    const { prompt, existingLines, previousPrompt } = await vovk.body();

    const system = getClarifyPrompt({
      existingLines: existingLines as ChunkComponent[] | undefined,
      previousPrompt,
    });

    const result = await generateText({
      model: "anthropic/claude-sonnet-4-20250514",
      system,
      prompt,
    });

    return { text: result.text };
  });

  /**
   * Generate or edit UI chunks.
   * - Without editElementId: full generation (optionally context-aware)
   * - With editElementId: targeted element editing
   */
  @post("ui")
  static render = procedure({
    body: z.object({
      editElementId: z.string().optional(),
      existingLines: z.any().array().optional(),
      previousPrompt: z.string().optional(),
      prompt: z.string(),
    }),
  }).handle(async ({ vovk }) => {
    const { prompt, editElementId, existingLines, previousPrompt } =
      await vovk.body();

    let system: string;

    if (editElementId && existingLines) {
      // Edit mode: targeted element replacement
      system = getEditPrompt({
        editElementId,
        existingLines: existingLines as ChunkComponent[],
        prompt,
      });
    } else {
      // Full generation (optionally with existing context)
      system = getPrompt({
        existingLines: existingLines as ChunkComponent[] | undefined,
        previousPrompt,
      });
    }

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
  });
}
