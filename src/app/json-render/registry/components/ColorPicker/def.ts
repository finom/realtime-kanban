import z from "zod";
import { createAIComponentDef } from "../../../createAIComponentDef";

export const ColorPickerDef = createAIComponentDef({
  description:
    "A color picker input for selecting a color value. Renders a native HTML color input alongside a text input showing the hex value. Use ColorPicker for theme customization, brand color selection, or any color-related settings.",
  propDefs: z.strictObject({
    value: z.string().default("#000000").meta({
      description: "The current color as a hex string, e.g. '#ff5500'",
    }),
    disabled: z.boolean().default(false).meta({
      description: "Whether the color picker is disabled",
    }),
  }),
  callbackDefs: {
    onChange: z.strictObject({
      value: z.string().meta({
        description: "The newly selected color as a hex string",
      }),
    }),
  },
});
