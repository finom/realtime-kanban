import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { DatePickerDef } from "./def";

export const DatePickerRenderer = createAIComponentRenderer({
  def: DatePickerDef,
  renderer: ({ value, min, max, disabled = false, onChange, generatedId }) => {
    return (
      <input
        type="date"
        value={value ?? ""}
        min={min}
        max={max}
        disabled={disabled}
        onChange={(e) => onChange?.({ value: e.target.value })}
        data-id={generatedId}
        className="border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
      />
    );
  },
});
