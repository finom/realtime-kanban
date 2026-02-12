import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { Label as ShadcnLabel } from "@/components/ui/label";
import { LabelDef } from "./def";

export const LabelRenderer = createAIComponentRenderer({
  def: LabelDef,
  renderer: ({ children, htmlFor, generatedId }) => {
    return (
      <ShadcnLabel htmlFor={htmlFor} data-id={generatedId}>
        {String(children ?? "")}
      </ShadcnLabel>
    );
  },
});
