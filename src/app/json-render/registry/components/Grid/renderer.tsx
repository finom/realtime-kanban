import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { pickClick } from "../../shared";
import { GridDef } from "./def";

export const GridRenderer = createAIComponentRenderer({
  def: GridDef,
  renderer: ({ columns = "3", gap = "4", children, onClick, generatedId }) => {
    const colsMap: Record<string, string> = {
      "1": "grid-cols-1",
      "2": "grid-cols-2",
      "3": "grid-cols-3",
      "4": "grid-cols-4",
      "5": "grid-cols-5",
      "6": "grid-cols-6",
    };
    return (
      <div
        className={`grid ${colsMap[columns]} gap-${gap}`}
        onClick={(e) => onClick?.(pickClick(e))}
        data-id={generatedId}
      >
        {children}
      </div>
    );
  },
});
