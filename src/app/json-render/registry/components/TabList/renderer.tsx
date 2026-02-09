import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { TabsList } from "@/components/ui/tabs";
import { TabListDef } from "./def";

export const TabListRenderer = createAIComponentRenderer(TabListDef, ({ children }) => {
  return <TabsList>{children}</TabsList>;
});
