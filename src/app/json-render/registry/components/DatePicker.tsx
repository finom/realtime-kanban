import z from "zod";
import { createAIComponent } from "../../createAIComponent";

export const DatePicker = createAIComponent({
  description:
    "A date input field that uses the native HTML date picker. Renders an input[type=date]. Use DatePicker for selecting a single date (birthdate, due date, start date, etc.). The value is an ISO date string (YYYY-MM-DD).",
  propDefs: z.strictObject({
    value: z
      .string()
      .optional()
      .meta({ description: "The selected date as ISO string (YYYY-MM-DD)" }),
    min: z
      .string()
      .optional()
      .meta({
        description: "Minimum selectable date as ISO string (YYYY-MM-DD)",
      }),
    max: z
      .string()
      .optional()
      .meta({
        description: "Maximum selectable date as ISO string (YYYY-MM-DD)",
      }),
    disabled: z
      .boolean()
      .default(false)
      .meta({ description: "Whether the date picker is disabled" }),
  }),
  callbackDefs: {
    onChange: z.strictObject({
      value: z.string().meta({
        description: "The newly selected date as ISO string (YYYY-MM-DD)",
      }),
    }),
  },
  render: ({ value, min, max, disabled = false, onChange }) => {
    return (
      <input
        type="date"
        value={value ?? ""}
        min={min}
        max={max}
        disabled={disabled}
        onChange={(e) => onChange?.({ value: e.target.value })}
        className="border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
      />
    );
  },
});
