import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { ColorPickerDef } from "./def";

export const ColorPickerRenderer = createAIComponentRenderer({
  def: ColorPickerDef,
  renderer: ({ value = "#000000", disabled = false, onChange, generatedId }) => {
    return (
      <div className="flex items-center gap-2" data-id={generatedId}>
        <input
          type="color"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange?.({ value: e.target.value })}
          className="h-9 w-9 cursor-pointer rounded-md border border-input p-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <input
          type="text"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange?.({ value: e.target.value })}
          className="border-input flex h-9 w-28 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    );
  },
});
