import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { ListDef } from "./def";

export const ListRenderer = createAIComponentRenderer({
  def: ListDef,
  renderer: ({ ordered = false, styleType = "disc", children, generatedId }) => {
    const styleMap: Record<string, string> = {
      disc: "list-disc",
      decimal: "list-decimal",
      none: "list-none",
    };
    const Tag = ordered ? "ol" : "ul";
    return (
      <Tag
        className={`${styleMap[styleType]} pl-5 space-y-1 text-sm [&>*]:list-item`}
        data-id={generatedId}
      >
        {children}
      </Tag>
    );
  },
});
