import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { Separator } from "@/components/ui/separator";
import { DividerDef } from "./def";

export const DividerRenderer = createAIComponentRenderer(DividerDef, ({ orientation = "horizontal" }) => {
  return <Separator orientation={orientation} />;
});
