import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { NumberInputDef } from "./def";

export const NumberInputRenderer = createAIComponentRenderer(NumberInputDef, ({
  value,
  min,
  max,
  step,
  disabled = false,
  placeholder,
  onChange,
}) => {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(e) => onChange?.({ value: e.target.valueAsNumber || 0 })}
      className="border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
    />
  );
});
