import z from "zod";
import { createAIComponent } from "../../createAIComponent";

export const Field = createAIComponent({
  description:
    "A form field wrapper that groups a FieldLabel, an input component (Input, Select, DatePicker, Checkbox, NumberInput, etc.), and an optional FieldDescription together. Children should be FieldLabel, then the input, then optionally FieldDescription. Provides consistent spacing and layout for form fields.",
  propDefs: z.strictObject({
    disabled: z
      .boolean()
      .default(false)
      .meta({ description: "Whether the entire field group is disabled" }),
  }),
  render: ({ disabled = false, children }) => {
    return (
      <div
        className="flex flex-col gap-2"
        data-disabled={disabled || undefined}
      >
        {children}
      </div>
    );
  },
});
