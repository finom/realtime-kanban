import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { IconDef } from "./def";

export const IconRenderer = createAIComponentRenderer({
  def: IconDef,
  renderer: ({ name, size = "md", color }) => {
    const sizeMap: Record<string, string> = {
      sm: "size-4",
      md: "size-5",
      lg: "size-6",
      xl: "size-8",
    };
    const IconComponent = (
      LucideIcons as unknown as Record<string, LucideIcon>
    )[name];
    if (!IconComponent) {
      return <span className="text-muted-foreground text-xs">[{name}]</span>;
    }
    return (
      <IconComponent
        className={`${sizeMap[size]} ${color ? `text-${color}` : ""}`}
      />
    );
  },
});
