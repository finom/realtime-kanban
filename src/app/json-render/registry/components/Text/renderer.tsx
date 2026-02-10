import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { TextDef } from "./def";

export const TextRenderer = createAIComponentRenderer({
  def: TextDef,
  renderer: ({ children, variant = "body", as: Tag = "span" }) => {
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
