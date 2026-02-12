import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { pickClick } from "../../shared";
import { Button } from "@/components/ui/button";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { IconButtonDef } from "./def";

export const IconButtonRenderer = createAIComponentRenderer({
  def: IconButtonDef,
  renderer: ({
    icon,
    variant = "ghost",
    size = "default",
    disabled = false,
    tooltip,
    onClick,
    generatedId,
  }) => {
    const IconComponent = (
      LucideIcons as unknown as Record<string, LucideIcon>
    )[icon];
    return (
      <Button
        variant={variant}
        size="icon"
        disabled={disabled}
        title={tooltip}
        onClick={(e) => onClick?.(pickClick(e))}
        data-id={generatedId}
        className={size === "sm" ? "size-8" : size === "lg" ? "size-10" : "size-9"}
      >
        {IconComponent ? (
          <IconComponent className="size-4" />
        ) : (
          <span className="text-xs">[{icon}]</span>
        )}
      </Button>
    );
  },
});
