import z from "zod";
import { createAIComponentDef } from "../../../createAIComponentDef";
import { onClickSchema } from "../../shared";

export const ButtonDef = createAIComponentDef({
  description:
    "A clickable button for triggering actions. Supports multiple visual variants and sizes. Use Button for form submissions, actions, navigation triggers, or any interactive click target. The children prop sets the button label text.",
  propDefs: z.strictObject({
    children: z.any().optional().meta({ description: "The button label text" }),
    variant: z
      .enum(["default", "destructive", "outline", "secondary", "ghost", "link"])
      .default("default")
      .meta({
        description:
          "Visual variant: default (primary filled), destructive (red), outline (bordered), secondary (gray), ghost (transparent), link (underlined text)",
      }),
    size: z.enum(["default", "sm", "lg", "icon"]).default("default").meta({
      description:
        "Button size: default, sm (small), lg (large), icon (square icon button)",
    }),
    disabled: z
      .boolean()
      .default(false)
      .meta({ description: "Whether the button is disabled" }),
  }),
  callbackDefs: {
    onClick: onClickSchema,
  },
});
