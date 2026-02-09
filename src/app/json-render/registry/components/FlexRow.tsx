import z from "zod";
import { createAIComponent } from "../../createAIComponent";
import { onClickSchema, pickClick } from "../shared";

export const FlexRow = createAIComponent({
  description:
    "A horizontal flex container that lays out children in a row. Use FlexRow to arrange components side by side horizontally with configurable gap, alignment, and wrapping. Common uses: button groups, inline form fields, stat cards in a row, icon + text combos.",
  propDefs: z.strictObject({
    gap: z
      .enum(["0", "1", "2", "3", "4", "6", "8"])
      .default("2")
      .meta({
        description: "Gap between children using Tailwind spacing scale (0-8)",
      }),
    align: z
      .enum(["start", "center", "end", "stretch", "baseline"])
      .default("center")
      .meta({ description: "Vertical alignment of children" }),
    justify: z
      .enum(["start", "center", "end", "between", "around", "evenly"])
      .default("start")
      .meta({ description: "Horizontal distribution of children" }),
    wrap: z
      .boolean()
      .default(false)
      .meta({
        description:
          "Whether children wrap to the next line when there is no space",
      }),
  }),
  callbackDefs: {
    onClick: onClickSchema,
  },
  render: ({
    gap = "2",
    align = "center",
    justify = "start",
    wrap = false,
    children,
    onClick,
  }) => {
    const gapClass = `gap-${gap}`;
    const alignMap: Record<string, string> = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    };
    const justifyMap: Record<string, string> = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    };
    return (
      <div
        className={`flex flex-row ${gapClass} ${alignMap[align]} ${justifyMap[justify]} ${wrap ? "flex-wrap" : ""}`}
        onClick={(e) => onClick?.(pickClick(e))}
      >
        {children}
      </div>
    );
  },
});
