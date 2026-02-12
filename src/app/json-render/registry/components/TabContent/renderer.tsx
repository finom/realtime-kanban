import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { TabsContent } from "@/components/ui/tabs";
import { TabContentDef } from "./def";

export const TabContentRenderer = createAIComponentRenderer({
  def: TabContentDef,
  renderer: ({ value, children, generatedId }) => {
    return (
      <TabsContent value={value} data-id={generatedId}>
        {children}
      </TabsContent>
    );
  },
});
