import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { Separator } from "@/components/ui/separator";
import { DividerDef } from "./def";

export const DividerRenderer = createAIComponentRenderer({
  def: DividerDef,
  renderer: ({ orientation = "horizontal", generatedId }) => {
    return <Separator orientation={orientation} data-id={generatedId} />;
  },
});
