import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { RadioDef } from "./def";

export const RadioRenderer = createAIComponentRenderer({
  def: RadioDef,
  renderer: ({
    value,
    options = [],
    orientation = "vertical",
    disabled = false,
    onChange,
    generatedId,
  }) => {
    const dirClass = orientation === "horizontal" ? "flex-row" : "flex-col";
    return (
      <div
        className={`flex ${dirClass} gap-2`}
        role="radiogroup"
        data-id={generatedId}
      >
        {options.map((opt) => {
          const isSelected = opt.value === value;
          return (
            <label
              key={opt.value}
              className={`flex items-center gap-2 cursor-pointer text-sm ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={disabled}
                className={`size-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-input bg-transparent"
                }`}
                onClick={() => onChange?.({ value: opt.value })}
              >
                {isSelected && (
                  <span className="size-1.5 rounded-full bg-primary-foreground" />
                )}
              </button>
              {opt.label}
            </label>
          );
        })}
      </div>
    );
  },
});
