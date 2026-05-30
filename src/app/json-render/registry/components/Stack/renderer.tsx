import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { pickClick } from "../../shared";
import { StackDef } from "./def";

export const StackRenderer = createAIComponentRenderer({
  def: StackDef,
  renderer: ({
    direction = "vertical",
    gap = "2",
    align = "stretch",
    children,
    onClick,
    generatedId,
  }) => {
    const dirClass = direction === "horizontal" ? "flex-row" : "flex-col";
    const alignMap: Record<string, string> = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    };
    return (
      <div
        className={`flex ${dirClass} gap-${gap} ${alignMap[align]}`}
        onClick={(e) => onClick?.(pickClick(e))}
        data-id={generatedId}
      >
        {children}
      </div>
    );
  },
});
