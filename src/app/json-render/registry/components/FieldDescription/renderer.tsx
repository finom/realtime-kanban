import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { FieldDescriptionDef } from "./def";

export const FieldDescriptionRenderer = createAIComponentRenderer({
  def: FieldDescriptionDef,
  renderer: ({ children, generatedId }) => {
    return (
      <p className="text-sm text-muted-foreground" data-id={generatedId}>{String(children ?? "")}</p>
    );
  },
});
