import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { Label } from "@/components/ui/label";
import { FieldLabelDef } from "./def";

export const FieldLabelRenderer = createAIComponentRenderer({
  def: FieldLabelDef,
  renderer: ({ children, htmlFor }) => {
    return <Label htmlFor={htmlFor}>{String(children ?? "")}</Label>;
  },
});
