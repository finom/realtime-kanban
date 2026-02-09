import z from "zod";
import { createAIComponent } from "../../createAIComponent";

export const Heading = createAIComponent({
  description:
    "A heading component for displaying titles and section headers. Renders h1-h6 HTML heading tags. Use Heading for page titles, section titles, and any prominent text that defines content hierarchy.",
  propDefs: z.strictObject({
    level: z
      .enum(["1", "2", "3", "4", "5", "6"])
      .default("2")
      .meta({
        description: "The heading level (1-6), maps to h1-h6 HTML tags",
      }),
    children: z
      .any()
      .optional()
      .meta({ description: "The heading text content" }),
  }),
  render: ({ level = "2", children }) => {
    const Tag = `h${level}` as keyof Pick<
      React.JSX.IntrinsicElements,
      "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
    >;
    const sizes: Record<string, string> = {
      "1": "text-4xl font-extrabold tracking-tight",
      "2": "text-3xl font-semibold tracking-tight",
      "3": "text-2xl font-semibold tracking-tight",
      "4": "text-xl font-semibold tracking-tight",
      "5": "text-lg font-medium",
      "6": "text-base font-medium",
    };
    return <Tag className={sizes[level]}>{children}</Tag>;
  },
});
