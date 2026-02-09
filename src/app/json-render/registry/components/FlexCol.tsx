import z from "zod";
import { createAIComponent } from "../../createAIComponent";
import { onClickSchema, pickClick } from "../shared";

export const FlexCol = createAIComponent({
  description:
    "A vertical flex container that lays out children in a column. Use FlexCol to stack components vertically with configurable gap and alignment. Common uses: form layouts, card content stacking, page sections.",
  propDefs: z.strictObject({
    gap: z
      .enum(["0", "1", "2", "3", "4", "6", "8"])
      .default("2")
      .meta({
        description: "Gap between children using Tailwind spacing scale (0-8)",
      }),
    align: z
      .enum(["start", "center", "end", "stretch"])
      .default("stretch")
      .meta({ description: "Horizontal alignment of children" }),
    justify: z
      .enum(["start", "center", "end", "between", "around", "evenly"])
      .default("start")
      .meta({ description: "Vertical distribution of children" }),
  }),
  callbackDefs: {
    onClick: onClickSchema,
  },
  render: ({
    gap = "2",
    align = "stretch",
    justify = "start",
    children,
    onClick,
  }) => {
    const gapClass = `gap-${gap}`;
    const alignMap: Record<string, string> = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
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
        className={`flex flex-col ${gapClass} ${alignMap[align]} ${justifyMap[justify]}`}
        onClick={(e) => onClick?.(pickClick(e))}
      >
        {children}
      </div>
    );
  },
});
