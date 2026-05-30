import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { DateRangePickerDef } from "./def";

const inputClass =
  "border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

export const DateRangePickerRenderer = createAIComponentRenderer({
  def: DateRangePickerDef,
  renderer: ({
    startDate,
    endDate,
    min,
    max,
    disabled = false,
    onChange,
    generatedId,
  }) => {
    return (
      <div className="flex items-center gap-2" data-id={generatedId}>
        <input
          type="date"
          value={startDate ?? ""}
          min={min}
          max={endDate || max}
          disabled={disabled}
          onChange={(e) =>
            onChange?.({
              startDate: e.target.value,
              endDate: endDate ?? "",
            })
          }
          className={inputClass}
        />
        <span className="text-sm text-muted-foreground">to</span>
        <input
          type="date"
          value={endDate ?? ""}
          min={startDate || min}
          max={max}
          disabled={disabled}
          onChange={(e) =>
            onChange?.({
              startDate: startDate ?? "",
              endDate: e.target.value,
            })
          }
          className={inputClass}
        />
      </div>
    );
  },
});
