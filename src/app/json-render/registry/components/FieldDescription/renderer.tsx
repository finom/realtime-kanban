import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { FieldDescriptionDef } from "./def";

export const FieldDescriptionRenderer = createAIComponentRenderer(FieldDescriptionDef, ({ children }) => {
  return (
    <p className="text-sm text-muted-foreground">{String(children ?? "")}</p>
  );
});
