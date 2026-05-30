import { createReactiveProxy } from "./createReactiveProxy";
import type { createAIComponentDef } from "./createAIComponentDef";
import type { ChunkComponent } from "./types";
import { ListRenderer, RecursiveRenderer } from "./RecursiveRenderer";
import { buildElementsById } from "./utils";

export const createAIComponentRegistry = (
  components: Record<string, ReturnType<typeof createAIComponentDef>>,
) => {
  const root = createReactiveProxy({});

  return {
    components,
    Renderer: ({ lines }: { lines: ChunkComponent[] }) => {
      const elementsById = buildElementsById(lines);

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
