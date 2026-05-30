import z from "zod";
import { createAIComponentDef } from "../../../createAIComponentDef";

export const TabListDef = createAIComponentDef({
  description:
    "A horizontal bar that contains TabTrigger components. Must be placed inside a Tabs component. Renders the row of tab buttons. Children must be TabTrigger components.",
  propDefs: z.strictObject({}),
});
