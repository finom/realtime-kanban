import z from "zod";
import { createAIComponent } from "../../createAIComponent";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const LineChart = createAIComponent({
  description:
    "A line chart for visualizing data trends over time or continuous categories. Each line represents a data series. Use LineChart for time series, trends, progress tracking, etc. The 'data' prop is an array of objects, 'xKey' is the key for x-axis labels, and 'yKeys' are the keys for line values. IMPORTANT: if using size() or other int-returning functions for values, convert with string(size(...)) or double(size(...)).",
  propDefs: z.strictObject({
    data: z
      .array(z.record(z.string(), z.union([z.string(), z.number(), z.boolean()]).nullable()))
      .meta({
        description:
          "Array of data objects, e.g. [{date: 'Jan', value: 100}, ...]",
      }),
    xKey: z
      .string()
      .meta({ description: "The key in data objects for x-axis labels" }),
    yKeys: z
      .array(z.string())
      .meta({
        description: "Array of keys for line values, e.g. ['revenue', 'cost']",
      }),
    colors: z.array(z.string()).optional().meta({
      description:
        "Optional hex color strings for each line, e.g. ['#8884d8', '#82ca9d']",
    }),
    height: z
      .number()
      .default(300)
      .meta({ description: "Chart height in pixels" }),
    curved: z
      .boolean()
      .default(true)
      .meta({
        description: "Whether lines are curved (monotone) or straight (linear)",
      }),
  }),
  render: ({
    data = [],
    xKey,
    yKeys = [],
    colors,
    height = 300,
    curved = true,
  }) => {
    const defaultColors = [
      "#8884d8",
      "#82ca9d",
      "#ffc658",
      "#ff7300",
      "#0088fe",
      "#00c49f",
    ];
    const lineColors = colors ?? defaultColors;
    return (
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {yKeys.map((key, i) => (
            <Line
              key={key}
              type={curved ? "monotone" : "linear"}
              dataKey={key}
              stroke={lineColors[i % lineColors.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    );
  },
});
