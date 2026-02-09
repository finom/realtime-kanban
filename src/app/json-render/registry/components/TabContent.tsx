import z from "zod";
import { createAIComponent } from "../../createAIComponent";
import { TabsContent } from "@/components/ui/tabs";

export const TabContent = createAIComponent({
  description:
    "The content panel for a specific tab. Must be placed inside a Tabs component (as a sibling to TabList). The 'value' prop must match the corresponding TabTrigger's 'value' to link them. Only the active tab's content is shown. Can contain any children components.",
  propDefs: z.strictObject({
    value: z.string().meta({
      description:
        "Unique value identifying this tab panel, must match the corresponding TabTrigger value",
    }),
  }),
  render: ({ value, children }) => {
    return <TabsContent value={value}>{children}</TabsContent>;
  },
});
