import z from "zod";
import { createAIComponent } from "../../createAIComponent";
import { Input as ShadcnInput } from "@/components/ui/input";

export const Input = createAIComponent({
  description:
    "A text input field for single-line text, email, password, or number entry. Renders a styled input element. Use Input for form fields. For labels and descriptions, wrap with Field, FieldLabel, and FieldDescription components. For a dedicated numeric stepper, see NumberInput.",
  propDefs: z.strictObject({
    value: z.any().meta({ description: "The current input value" }),
    type: z
      .enum(["text", "email", "password", "number", "tel", "url", "search"])
      .default("text")
      .meta({ description: "The HTML input type" }),
    placeholder: z
      .string()
      .optional()
      .meta({ description: "Placeholder text shown when the input is empty" }),
    disabled: z
      .boolean()
      .default(false)
      .meta({ description: "Whether the input is disabled" }),
  }),
  callbackDefs: {
    onChange: z.strictObject({
      value: z
        .string()
        .meta({ description: "The current string value of the input" }),
      valueAsNumber: z.number().meta({
        description: "The current value as a number (0 if NaN)",
      }),
    }),
  },
  render: ({
    value,
    type = "text",
    placeholder,
    disabled = false,
    onChange,
  }) => {
    return (
      <ShadcnInput
        type={type}
        value={value as string | number | readonly string[] | undefined}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) =>
          onChange?.({
            value: e.target.value,
            valueAsNumber: e.target.valueAsNumber || 0,
          })
        }
      />
    );
  },
});
