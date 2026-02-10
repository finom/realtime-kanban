import { createReactiveProxy } from "./createReactiveProxy";
import type { createAIComponent } from "./createAIComponent";
import type { ChunkComponent } from "./types";
import { ListRenderer, RecursiveRenderer } from "./RecursiveRenderer";
import { JSONSchemaToTs } from "./JSONSchemaToTs";

export const createAIComponentRegistry = (
  components: Record<string, ReturnType<typeof createAIComponent>>,
) => {
  const root = createReactiveProxy({});

  function getDefPartialPrompt() {
    return (
      "# AVAILABLE COMPONENTS:\n" +
      Object.keys(components)
        .map((key) => key)
        .join(", ") +
      "\n\n# COMPONENT DETAILS:\n" +
      Object.entries(components)
        .map(([name, { description, propDefs, callbackDefs }]) => {
          const propDefsJSONSchema = propDefs["~standard"].jsonSchema.input({
            target: "draft-2020-12",
          });
          const propDefTs = JSONSchemaToTs(propDefsJSONSchema);
          const callbackSubPrompt = Object.entries(callbackDefs || {})
            .map(([cbName, cbDef]) => {
              const cbDefJSONSchema = cbDef["~standard"].jsonSchema.input({
                target: "draft-2020-12",
              });
              const cbDefTs = JSONSchemaToTs(cbDefJSONSchema);
              return `  - ${cbName}: ${cbDefTs}`;
            })
            .join("\n");
          return `- ${name}: ${propDefTs} - ${description}; ${callbackSubPrompt ? `Event handlers:\n${callbackSubPrompt}` : ""}`;
        })
        .join("\n")
    );
  }

  return {
    components,
    getDefPartialPrompt,
    Renderer: ({ lines }: { lines: ChunkComponent[] }) => {
      const elementsById = lines.reduce(
        (acc, line) => {
          acc[line.id] = line;
          return acc;
        },
        {} as Record<string, ChunkComponent>,
      );

      // Only render root elements - children will be rendered recursively
      const rootElements = lines.filter((line) => line.op === "root");

      return rootElements.map((line) => {
        const comp = components[line.component];
        if (!comp) {
          return <div key={line.id}>Unknown component: {line.component}</div>;
        }
        if (line.type === "list") {
          // TODO: Is it possible? root lists?
          return (
            <ListRenderer
              key={line.id}
              elementKey={line.id}
              elements={elementsById}
              scopes={{ root }}
              line={line}
            />
          );
        }
        return (
          <RecursiveRenderer
            key={line.id}
            elementKey={line.id}
            elements={elementsById}
            scopes={{ root }}
          />
        );
      });
    },
  };
};
