import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { TabsTrigger } from "@/components/ui/tabs";
import { TabTriggerDef } from "./def";

export const TabTriggerRenderer = createAIComponentRenderer(TabTriggerDef, ({ value, children }) => {
  return <TabsTrigger value={value}>{String(children ?? value)}</TabsTrigger>;
});
