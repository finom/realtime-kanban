import z from "zod";
import { createAIComponent } from "../../createAIComponent";
import { Checkbox as ShadcnCheckbox } from "@/components/ui/checkbox";

export const Checkbox = createAIComponent({
  description:
    "A checkbox input for boolean (true/false) values. Renders a styled square checkbox that can be checked or unchecked. Use Checkbox for toggling a setting on/off, accepting terms, or any boolean choice. For a label, place a FieldLabel next to it inside a Field component with a horizontal layout.",
  propDefs: z.strictObject({
    checked: z
      .boolean()
      .default(false)
      .meta({ description: "Whether the checkbox is checked" }),
    disabled: z
      .boolean()
      .default(false)
      .meta({ description: "Whether the checkbox is disabled" }),
    label: z
      .string()
      .optional()
      .meta({ description: "Optional inline label text next to the checkbox" }),
  }),
  callbackDefs: {
    onChange: z.strictObject({
      checked: z.boolean().meta({ description: "The new checked state" }),
    }),
  },
  render: ({ checked = false, disabled = false, label, onChange }) => {
    const id = label
      ? `checkbox-${label.replace(/\s/g, "-").toLowerCase()}`
      : undefined;
    return (
      <div className="flex items-center gap-2">
        <ShadcnCheckbox
          id={id}
          checked={checked}
          disabled={disabled}
          onCheckedChange={(v) => onChange?.({ checked: v === true })}
        />
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
      </div>
    );
  },
});
