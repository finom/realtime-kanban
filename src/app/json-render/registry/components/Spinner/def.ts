import z from "zod";
import { createAIComponentDef } from "../../../createAIComponentDef";

export const SpinnerDef = createAIComponentDef({
  description:
    "A loading spinner animation indicating that an operation is in progress. Renders an animated circular spinner. Use Spinner for loading states, async operations, or any time the user needs to wait. For skeleton placeholder loading, use Skeleton instead.",
  propDefs: z.strictObject({
    size: z.enum(["sm", "md", "lg", "xl"]).default("md").meta({
      description: "Spinner size: sm (16px), md (24px), lg (32px), xl (48px)",
    }),
    label: z.string().optional().meta({
      description: "Optional text shown below the spinner, e.g. 'Loading...'",
    }),
  }),
});
