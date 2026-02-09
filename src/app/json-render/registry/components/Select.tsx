import z from "zod";
import { createAIComponent } from "../../createAIComponent";
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Select = createAIComponent({
  description:
    "A dropdown select component for choosing one option from a list. Renders a styled select trigger that opens a dropdown popover with options. Use Select for any single-choice selection (status, category, country, etc.). The 'options' prop is an array of objects with 'label' and 'value'. For multi-select, use multiple Tag components or checkboxes instead.",
  propDefs: z.strictObject({
    value: z
      .string()
      .optional()
      .meta({ description: "The currently selected value" }),
    placeholder: z
      .string()
      .optional()
      .meta({ description: "Placeholder text when no value is selected" }),
    options: z
      .array(
        z.object({
          label: z
            .string()
            .meta({ description: "Display text for this option" }),
          value: z.string().meta({ description: "The value for this option" }),
        }),
      )
      .meta({ description: "Array of options to display in the dropdown" }),
    disabled: z
      .boolean()
      .default(false)
      .meta({ description: "Whether the select is disabled" }),
  }),
  callbackDefs: {
    onChange: z.strictObject({
      value: z.string().meta({ description: "The newly selected value" }),
    }),
  },
  render: ({
    value,
    placeholder,
    options = [],
    disabled = false,
    onChange,
  }) => {
    return (
      <ShadcnSelect
        value={value}
        disabled={disabled}
        onValueChange={(v) => onChange?.({ value: v })}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder ?? "Select..."} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </ShadcnSelect>
    );
  },
});
