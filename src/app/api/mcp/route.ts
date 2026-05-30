import { createMcpHandler } from "mcp-handler";
import { deriveTools, ToModelOutput } from "vovk";
import z from "zod";
import UserController from "@/modules/user/UserController";
import TaskController from "@/modules/task/TaskController";

const { tools } = deriveTools({
  modules: {
    UserController,
    TaskController,
  },
  toModelOutput: ToModelOutput.MCP,
  onExecute: (result, { name }) => console.log(`${name} executed`, result),
  onError: (e, { name }) => console.error(`Error in ${name}`, e),
});

const handler = createMcpHandler(
  (server) => {
    tools.forEach(({ title, name, execute, description, inputSchema }) => {
      server.registerTool(
        name,
        {
          title,
          description,
          inputSchema: inputSchema
            ? (
                z.fromJSONSchema(
                  inputSchema["~standard"].jsonSchema.input({ target: "draft-2020-12" }),
                ) as z.ZodObject
              ).shape
            : undefined,
        },
        execute,
      );
    });
  },
  {},
  { basePath: "/api" },
);

const authorizedHandler = (req: Request) => {
  const { MCP_ACCESS_KEY } = process.env;
  const accessKey = new URL(req.url).searchParams.get("mcp_access_key");
  if (MCP_ACCESS_KEY && accessKey !== MCP_ACCESS_KEY) {
    return new Response(
      "Unable to authorize the MCP request: mcp_access_key query parameter is invalid",
      { status: 401 },
    );
  }
  return handler(req);
};

export { authorizedHandler as GET, authorizedHandler as POST };
