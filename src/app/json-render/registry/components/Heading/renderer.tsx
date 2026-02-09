import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { HeadingDef } from "./def";

export const HeadingRenderer = createAIComponentRenderer(HeadingDef, ({ level = "2", children }) => {
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
});
