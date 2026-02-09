import z from "zod";
import { createAIComponent } from "../../createAIComponent";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const PieChart = createAIComponent({
  description:
    "A pie/donut chart for visualizing proportions and parts-of-a-whole relationships. Use PieChart for market share, budget breakdown, category distribution, etc. The 'data' prop is an array of objects with 'name' (string) and 'value' (number) keys. IMPORTANT: 'value' must be a double, not an int. Use double(size(...)) or double(intValue) to convert int values. Set 'donut' to true for a donut chart with a hole in the center.",
  propDefs: z.strictObject({
    data: z
      .array(
        z.object({
          name: z.string().meta({ description: "The label for this slice" }),
          value: z
            .number()
            .meta({ description: "The numeric value for this slice. Must be a double, not an int. Use double() to convert." }),
        }),
      )
      .meta({ description: "Array of data objects with name and value" }),
    colors: z.array(z.string()).optional().meta({
      description:
        "Optional hex color strings for each slice, e.g. ['#8884d8', '#82ca9d']",
    }),
    height: z
      .number()
      .default(300)
      .meta({ description: "Chart height in pixels" }),
    donut: z
      .boolean()
      .default(false)
      .meta({
        description:
          "Whether to render as a donut chart (with a hole in the center)",
      }),
    showLabels: z
      .boolean()
      .default(true)
      .meta({ description: "Whether to show labels on each slice" }),
  }),
  render: ({
    data: rawData = [],
    colors,
    height = 300,
    donut = false,
    showLabels = true,
  }) => {
    const data = rawData.map((d) => ({ ...d, value: Number(d.value) }));
    const defaultColors = [
      "#8884d8",
      "#82ca9d",
      "#ffc658",
      "#ff7300",
      "#0088fe",
      "#00c49f",
      "#ffbb28",
      "#ff8042",
      "#a4de6c",
      "#d0ed57",
    ];
    const sliceColors = colors ?? defaultColors;
    return (
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={donut ? "40%" : 0}
            outerRadius="80%"
            dataKey="value"
            nameKey="name"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            label={
              showLabels
                ? (((props: any) =>
                    `${String(props.name ?? "")} ${(Number(props.percent ?? 0) * 100).toFixed(0)}%`) as never)
                : undefined
            }
          >
            {data.map((_entry, i) => (
              <Cell key={i} fill={sliceColors[i % sliceColors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    );
  },
});
