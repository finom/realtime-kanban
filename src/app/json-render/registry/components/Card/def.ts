import z from "zod";
import { createAIComponentDef } from "../../../createAIComponentDef";
import { onClickSchema } from "../../shared";

export const CardDef = createAIComponentDef({
  description:
    "A container component with rounded corners, shadow, and border for grouping related content. Can contain any children components. Optionally displays a title and description in a header area. Use Card to visually group related UI elements such as forms, stats, or content sections.",
  propDefs: z.strictObject({
    title: z
      .string()
      .optional()
      .meta({ description: "Optional header title text" }),
    description: z
      .string()
      .optional()
      .meta({ description: "Optional description text shown below the title" }),
  }),
  callbackDefs: {
    onClick: onClickSchema,
  },
});
