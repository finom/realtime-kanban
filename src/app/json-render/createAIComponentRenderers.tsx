import type { AIComponentRenderer } from "./createAIComponentRenderer";
import type { ChunkComponent } from "./types";
import { createReactiveProxy } from "./createReactiveProxy";
import { ListRenderer, RecursiveRenderer } from "./RecursiveRenderer";
import { uniqBy } from "lodash";
import { buildElementsById } from "./utils";
import { EditModeOverlay } from "./EditModeOverlay";

export const createAIComponentRenderers = <
  T extends Record<string, AIComponentRenderer>,
>(
  renderers: T,
) => {
  const root = createReactiveProxy({});

  return {
    renderers,
    Renderer: ({
      lines,
      editMode = false,
    }: {
      lines: ChunkComponent[];
      editMode?: boolean;
    }) => {
      const elementsById = buildElementsById(lines);

      const rootElements = uniqBy(
        lines.filter((line) => line.op === "root"),
        "id",
      );

      const content = rootElements.map((line) => {
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

      return (
        <EditModeOverlay enabled={editMode}>{content}</EditModeOverlay>
      );
    },
  };
};
