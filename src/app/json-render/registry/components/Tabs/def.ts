import z from "zod";
import { createAIComponentDef } from "../../../createAIComponentDef";

export const TabsDef = createAIComponentDef({
  description:
    "A tabbed navigation container. Must contain TabList and TabContent children. The 'value' prop controls which tab is active, and 'onValueChange' fires when a tab is clicked. Children should be: one TabList (containing TabTrigger items) followed by multiple TabContent components. Each TabTrigger and TabContent must share the same 'value' string to be linked.",
  propDefs: z.strictObject({
    value: z.string().meta({
      description: "The currently active tab value string",
    }),
    defaultValue: z.string().optional().meta({
      description: "The initial active tab value if uncontrolled",
    }),
  }),
  callbackDefs: {
    onValueChange: z
      .object({
        value: z.string().meta({ description: "The newly selected tab value" }),
      })
      .meta({ description: "Callback when the active tab changes" }),
  },
});
