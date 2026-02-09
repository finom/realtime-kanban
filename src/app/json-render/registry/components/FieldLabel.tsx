import z from "zod";
import { createAIComponent } from "../../createAIComponent";
import { Label } from "@/components/ui/label";

export const FieldLabel = createAIComponent({
  description:
    "A form field label. Must be placed inside a Field component, before the input element. Renders a styled label element. Use FieldLabel to label any form input (Input, Select, DatePicker, Checkbox, NumberInput, etc.).",
  propDefs: z.strictObject({
    children: z.any().optional().meta({ description: "The label text" }),
    htmlFor: z
      .string()
      .optional()
      .meta({ description: "The ID of the input element this label is for" }),
  }),
  render: ({ children, htmlFor }) => {
    return <Label htmlFor={htmlFor}>{String(children ?? "")}</Label>;
  },
});
