import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { TabsTrigger } from "@/components/ui/tabs";
import Skeleton from "react-loading-skeleton";
import { TabTriggerDef } from "./def";

export const TabTriggerRenderer = createAIComponentRenderer({
  def: TabTriggerDef,
  renderer: ({ value, children }) => {
  return <TabsTrigger value={value}>{String(children ?? value)}</TabsTrigger>;
  },
});
