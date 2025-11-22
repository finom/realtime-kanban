import { prefix, get, HttpException, HttpStatus } from "vovk";
import { z } from "zod";
import { withZod } from "@/lib/withZod";
import { sessionGuard } from "@/decorators/sessionGuard";

@prefix("realtime")
export default class RealtimeController {
  @get("session")
  @sessionGuard()
  static session = withZod({
    query: z.object({
      voice: z.enum(["ash", "ballad", "coral", "sage", "verse"]),
    }),
    async handle(req) {
      if (!process.env.OPENAI_API_KEY) {
        throw new HttpException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          `OPENAI_API_KEY is not set`,
        );
      }
      const response = await fetch(
        "https://api.openai.com/v1/realtime/sessions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-realtime",
            voice: req.vovk.query().voice,
            modalities: ["audio", "text"],
            instructions:
              "Speak and respond in the language of the user. Use the available tools when relevant. After executing a tool, you will need to respond to the user sharing the function result or error.",
            tool_choice: "auto",
          }),
        },
      );

      if (!response.ok) {
        throw new HttpException(
          response.status || HttpStatus.INTERNAL_SERVER_ERROR,
          `API request failed with status ${response.status}`,
        );
      }

      return response.json() as Promise<{ client_secret: { value: string } }>;
    },
  });
}
