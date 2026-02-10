import { getPrompt } from "@/app/json-render/getPrompt";
import { streamText } from "ai";
import PROMPT from "../../app/json-render/PROMPT.json" assert { type: "json" };
import { get, JSONLinesResponder } from "vovk";
import { ChunkComponentElement, ChunkComponentList } from "@/app/json-render/types";


export default class JsonRenderController {
    @get("/stream")
    static async render() {
         const systemPrompt = getPrompt();
        
          console.log("systemPrompt:", systemPrompt);
        
          const result = streamText({
            model: "anthropic/claude-opus-4.6",
            system: systemPrompt,
            prompt: 'график по дате выаолнения задач линейный и таблицы', // 'Generate me a users ui that displays number of tasks, allows to add search delete users, shows pie chart',
          });
        
          return new Response(result.textStream, {
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          }) as unknown as JSONLinesResponder<ChunkComponentElement | ChunkComponentList>;
        }
}
