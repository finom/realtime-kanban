import { createReactiveProxy } from "./createReactiveProxy";
import type { createAIComponent } from "./createAIComponent";
import { ChunkComponent } from "./types";
import { ListRenderer, RecursiveRenderer } from "./render";

export const createAIComponentRegistry = (
  components: Record<string, ReturnType<typeof createAIComponent>>,
) => {
  const root = createReactiveProxy({});

  return {
    components,
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

      return rootElements.map((line, index) => {
        const Component = components[line.component];
        if (!Component) {
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
