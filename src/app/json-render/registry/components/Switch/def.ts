import z from "zod";
import { createAIComponentDef } from "../../../createAIComponentDef";

export const SwitchDef = createAIComponentDef({
  description:
    "A toggle switch for boolean on/off states. Renders a styled toggle that slides between on and off. Use Switch for enabling/disabling features, toggling settings, or any binary state. For a square checkbox, use Checkbox instead.",
  propDefs: z.strictObject({
    checked: z.boolean().default(false).meta({
      description: "Whether the switch is on (checked)",
    }),
    disabled: z.boolean().default(false).meta({
      description: "Whether the switch is disabled",
    }),
    label: z.string().optional().meta({
      description: "Optional inline label text next to the switch",
    }),
  }),
  callbackDefs: {
    onChange: z.strictObject({
      checked: z.boolean().meta({
        description: "The new checked state after toggling",
      }),
    }),
  },
});
