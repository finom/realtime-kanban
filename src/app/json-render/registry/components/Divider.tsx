import z from "zod";
import { createAIComponent } from "../../createAIComponent";
import { Separator } from "@/components/ui/separator";

export const Divider = createAIComponent({
  description:
    "A horizontal or vertical divider line for visually separating content sections. Use Divider between card sections, form groups, or any content that needs a visual break.",
  propDefs: z.strictObject({
    orientation: z
      .enum(["horizontal", "vertical"])
      .default("horizontal")
      .meta({ description: "Direction of the divider line" }),
  }),
  render: ({ orientation = "horizontal" }) => {
    return <Separator orientation={orientation} />;
  },
});
