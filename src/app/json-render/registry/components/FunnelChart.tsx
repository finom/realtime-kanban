import z from "zod";
import { createAIComponent } from "../../createAIComponent";
import {
  FunnelChart as RechartsFunnelChart,
  Funnel,
  Tooltip,
  LabelList,
  ResponsiveContainer,
  Cell,
} from "recharts";

export const FunnelChart = createAIComponent({
  description:
    "A funnel chart for visualizing stages in a pipeline or conversion process. Each stage is narrower than the previous one. Use FunnelChart for sales funnels, conversion funnels, recruitment pipelines, or any sequential stage-based data. The 'data' prop is an array of objects with 'name' (string) and 'value' (number) keys, ordered from largest (top) to smallest (bottom). IMPORTANT: 'value' must be a double, not an int. Use double(size(...)) or double(intValue) to convert int values.",
  propDefs: z.strictObject({
    data: z
      .array(
        z.object({
          name: z
            .string()
            .meta({ description: "The label for this funnel stage" }),
          value: z
            .number()
            .meta({ description: "The numeric value for this stage" }),
        }),
      )
      .meta({
        description:
          "Array of stage data, ordered from widest (first stage) to narrowest (last stage)",
      }),
    colors: z.array(z.string()).optional().meta({
      description: "Optional hex color strings for each stage",
    }),
    height: z
      .number()
      .default(300)
      .meta({ description: "Chart height in pixels" }),
  }),
  render: ({ data = [], colors, height = 300 }) => {
    const defaultColors = [
      "#8884d8",
      "#83a6ed",
      "#8dd1e1",
      "#82ca9d",
      "#a4de6c",
      "#d0ed57",
      "#ffc658",
      "#ff8042",
      "#ff7300",
      "#ff0000",
    ];
    const stageColors = colors ?? defaultColors;
    const dataWithFill = data.map((d, i) => ({
      ...d,
      fill: stageColors[i % stageColors.length],
    }));
    return (
      <ResponsiveContainer width="100%" height={height}>
        <RechartsFunnelChart>
          <Tooltip />
          <Funnel dataKey="value" data={dataWithFill} isAnimationActive>
            <LabelList
              position="right"
              fill="#000"
              stroke="none"
              dataKey="name"
            />
            {dataWithFill.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Funnel>
        </RechartsFunnelChart>
      </ResponsiveContainer>
    );
  },
});
