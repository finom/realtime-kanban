import z from "zod";
import { createAIComponent } from "../../createAIComponent";
import { TabsList } from "@/components/ui/tabs";

export const TabList = createAIComponent({
  description:
    "A horizontal bar that contains TabTrigger components. Must be placed inside a Tabs component. Renders the row of tab buttons. Children must be TabTrigger components.",
  propDefs: z.strictObject({}),
  render: ({ children }) => {
    return <TabsList>{children}</TabsList>;
  },
});
