import z from "zod";
import { createAIComponentDef } from "../../../createAIComponentDef";

export const DividerDef = createAIComponentDef({
  description:
    "A horizontal or vertical divider line for visually separating content sections. Use Divider between card sections, form groups, or any content that needs a visual break.",
  propDefs: z.strictObject({
    orientation: z
      .enum(["horizontal", "vertical"])
      .default("horizontal")
      .meta({ description: "Direction of the divider line" }),
  }),
});
