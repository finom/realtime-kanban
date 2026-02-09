import z from "zod";
import { createAIComponent } from "../../createAIComponent";

export const FieldDescription = createAIComponent({
  description:
    "A helper/description text for a form field. Must be placed inside a Field component, after the input element. Renders small muted text below the input. Use FieldDescription to provide additional context, validation hints, or instructions for a form field.",
  propDefs: z.strictObject({
    children: z
      .any()
      .optional()
      .meta({ description: "The description/helper text" }),
  }),
  render: ({ children }) => {
    return (
      <p className="text-sm text-muted-foreground">{String(children ?? "")}</p>
    );
  },
});
