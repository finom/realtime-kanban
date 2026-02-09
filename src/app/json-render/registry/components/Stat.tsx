import z from "zod";
import { createAIComponent } from "../../createAIComponent";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export const Stat = createAIComponent({
  description:
    "A statistics display component showing a label, a large number value, and an optional trend indicator. Use Stat for KPI cards, dashboard metrics, or any numeric summary (e.g. total revenue, user count, conversion rate).",
  propDefs: z.strictObject({
    label: z
      .string()
      .meta({ description: "The metric label, e.g. 'Total Revenue'" }),
    value: z.any().meta({
      description:
        "The primary display value, e.g. '$12,345' or 42 or '98%'. Rendered as a large number.",
    }),
    trend: z.enum(["up", "down", "neutral"]).optional().meta({
      description:
        "Optional trend arrow direction: up (green, positive), down (red, negative), neutral (gray, no change)",
    }),
    trendValue: z.string().optional().meta({
      description: "Optional trend text, e.g. '+12%' or '-3.2%'",
    }),
    helpText: z
      .string()
      .optional()
      .meta({
        description:
          "Optional helper text below the value, e.g. 'vs. last month'",
      }),
  }),
  render: ({ label, value, trend, trendValue, helpText }) => {
    const trendIcon =
      trend === "up" ? (
        <TrendingUp className="size-4 text-green-600" />
      ) : trend === "down" ? (
        <TrendingDown className="size-4 text-red-600" />
      ) : trend === "neutral" ? (
        <Minus className="size-4 text-muted-foreground" />
      ) : null;

    const trendColor =
      trend === "up"
        ? "text-green-600"
        : trend === "down"
          ? "text-red-600"
          : "text-muted-foreground";

    return (
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight">
            {String(value)}
          </span>
          {(trendIcon || trendValue) && (
            <span
              className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}
            >
              {trendIcon}
              {trendValue}
            </span>
          )}
        </div>
        {helpText && (
          <span className="text-xs text-muted-foreground">{helpText}</span>
        )}
      </div>
    );
  },
});
