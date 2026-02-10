import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { TabsContent } from "@/components/ui/tabs";
import { TabContentDef } from "./def";

export const TabContentRenderer = createAIComponentRenderer({
  def: TabContentDef,
  renderer: ({ value, children }) => {
    return <TabsContent value={value}>{children}</TabsContent>;
  },
});
