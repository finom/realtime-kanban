import z from "zod";
import { createAIComponent } from "../../createAIComponent";

export const Text = createAIComponent({
  description:
    "A text display component for rendering inline or block text. Renders a span (inline) or p (block) element. Use Text for body copy, labels, descriptions, or any general-purpose text content. Can display dynamic values by passing them as children.",
  propDefs: z.strictObject({
    children: z
      .any()
      .optional()
      .meta({ description: "The text content to display" }),
    variant: z
      .enum(["body", "muted", "lead", "small", "large"])
      .default("body")
      .meta({
        description:
          "Text style variant: body (default), muted (gray, secondary info), lead (larger intro text), small (smaller text), large (bigger text)",
      }),
    as: z
      .enum(["span", "p", "div"])
      .default("span")
      .meta({
        description:
          "HTML element to render: span (inline), p (paragraph), div (block)",
      }),
  }),
  render: ({ children, variant = "body", as: Tag = "span" }) => {
    const styles: Record<string, string> = {
      body: "text-base",
      muted: "text-sm text-muted-foreground",
      lead: "text-xl text-muted-foreground",
      small: "text-sm font-medium leading-none",
      large: "text-lg font-semibold",
    };
    return <Tag className={styles[variant]}>{String(children ?? "")}</Tag>;
  },
});
