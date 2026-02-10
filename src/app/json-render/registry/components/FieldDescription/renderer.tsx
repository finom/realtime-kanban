import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { FieldDescriptionDef } from "./def";

export const FieldDescriptionRenderer = createAIComponentRenderer({
  def: FieldDescriptionDef,
  renderer: ({ children }) => {
    return (
      <p className="text-sm text-muted-foreground">{String(children ?? "")}</p>
    );
  },
});
