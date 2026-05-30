import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { ProgressBarDef } from "./def";

export const ProgressBarRenderer = createAIComponentRenderer({
  def: ProgressBarDef,
  renderer: ({
    value = 0,
    max = 100,
    showLabel = false,
    color = "default",
    size = "md",
    generatedId,
  }) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const colorMap: Record<string, string> = {
      default: "bg-primary",
      success: "bg-green-500",
      warning: "bg-yellow-500",
      error: "bg-red-500",
    };
    const sizeMap: Record<string, string> = {
      sm: "h-1",
      md: "h-2",
      lg: "h-3",
    };
    return (
      <div className="w-full" data-id={generatedId}>
        {showLabel && (
          <div className="flex justify-between mb-1">
            <span className="text-sm text-muted-foreground">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
        <div
          className={`w-full ${sizeMap[size]} rounded-full bg-secondary overflow-hidden`}
        >
          <div
            className={`${sizeMap[size]} rounded-full transition-all duration-300 ${colorMap[color]}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  },
});
