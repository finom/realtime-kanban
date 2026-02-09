import z from "zod";
import { createAIComponent } from "../../createAIComponent";
import { onClickSchema, pickClick } from "../shared";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Tag = createAIComponent({
  description:
    "A removable tag/chip component for displaying labels, categories, or selected filters. Similar to Badge but with an optional close button. Use Tag for filter chips, selected multi-select values, or categorization labels that users can remove.",
  propDefs: z.strictObject({
    children: z.any().optional().meta({ description: "The tag text content" }),
    variant: z
      .enum(["default", "secondary", "destructive", "outline"])
      .default("secondary")
      .meta({
        description:
          "Visual style variant: default (primary), secondary (muted), destructive (red), outline (bordered)",
      }),
    removable: z
      .boolean()
      .default(false)
      .meta({
        description: "Whether to show a close/remove button on the tag",
      }),
  }),
  callbackDefs: {
    onClick: onClickSchema,
    onRemove: z
      .object({})
      .meta({ description: "Callback when the remove button is clicked" }),
  },
  render: ({
    children,
    variant = "secondary",
    removable = false,
    onClick,
    onRemove,
  }) => {
    return (
      <Badge
        variant={variant}
        className="gap-1 cursor-pointer"
        onClick={(e) => onClick?.(pickClick(e))}
      >
        {String(children ?? "")}
        {removable && (
          <button
            type="button"
            className="ml-0.5 rounded-full outline-none hover:bg-foreground/20 p-0.5"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.({});
            }}
          >
            <X className="size-3" />
          </button>
        )}
      </Badge>
    );
  },
});
