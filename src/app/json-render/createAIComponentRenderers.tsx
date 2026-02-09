import type { AIComponentRenderer } from "./createAIComponentRenderer";
import type { ChunkComponent } from "./types";
import { createReactiveProxy } from "./createReactiveProxy";
import { ListRenderer, RecursiveRenderer } from "./render";

export const createAIComponentRenderers = <
  T extends Record<string, AIComponentRenderer>,
>(
  renderers: T,
) => {
  const root = createReactiveProxy({});

  return {
    renderers,
    Renderer: ({ lines }: { lines: ChunkComponent[] }) => {
      const elementsById = lines.reduce(
        (acc, line) => {
          acc[line.id] = line;
          return acc;
        },
        {} as Record<string, ChunkComponent>,
      );

      const rootElements = lines.filter((line) => line.op === "root");

      return rootElements.map((line) => {
        const comp = renderers[line.component];
        if (!comp) {
          return <div key={line.id}>Unknown component: {line.component}</div>;
        }
        if (line.type === "list") {
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
