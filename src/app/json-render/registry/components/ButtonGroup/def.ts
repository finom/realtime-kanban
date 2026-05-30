import z from "zod";
import { createAIComponentDef } from "../../../createAIComponentDef";

export const ButtonGroupDef = createAIComponentDef({
  description:
    "A horizontal group of buttons displayed together with connected borders. Children must be Button or IconButton components. Use ButtonGroup for related actions like view mode toggles, segmented controls, or action toolbars.",
  propDefs: z.strictObject({
    attached: z.boolean().default(true).meta({
      description:
        "Whether buttons are visually attached (shared borders) or spaced apart",
    }),
  }),
});
