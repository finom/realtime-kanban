import z from "zod";
import { createAIComponent } from "../../createAIComponent";
import { Skeleton as ShadcnSkeleton } from "@/components/ui/skeleton";

export const Skeleton = createAIComponent({
  description:
    "A loading placeholder that shows a pulsing animation where content will appear. Use Skeleton to indicate content is loading. Renders a rounded rectangle of configurable width and height.",
  propDefs: z.strictObject({
    width: z.string().default("100%").meta({
      description: "CSS width value, e.g. '100%', '200px', '12rem'",
    }),
    height: z.string().default("1.25rem").meta({
      description: "CSS height value, e.g. '1.25rem', '40px', '100px'",
    }),
    rounded: z
      .enum(["sm", "md", "lg", "full"])
      .default("md")
      .meta({ description: "Border radius: sm, md, lg, or full (circle)" }),
  }),
  render: ({ width = "100%", height = "1.25rem", rounded = "md" }) => {
    const radiusMap: Record<string, string> = {
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
    };
    return (
      <ShadcnSkeleton
        className={radiusMap[rounded]}
        style={{ width, height }}
      />
    );
  },
});
