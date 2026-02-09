import z from "zod";
import { createAIComponent } from "../../createAIComponent";
import { onClickSchema, pickClick } from "../shared";
import { InboxIcon } from "lucide-react";

export const EmptyState = createAIComponent({
  description:
    "A placeholder component shown when there is no data to display. Shows an icon, a title, and an optional description. Use EmptyState inside tables, lists, or dashboards when there are zero results or no items yet. Can contain children components such as a Button to add an item.",
  propDefs: z.strictObject({
    title: z
      .string()
      .default("No data")
      .meta({
        description: "The primary empty state heading, e.g. 'No items found'",
      }),
    description: z
      .string()
      .optional()
      .meta({
        description: "Optional helper text, e.g. 'Try adjusting your filters'",
      }),
  }),
  callbackDefs: {
    onClick: onClickSchema,
  },
  render: ({ title = "No data", description, children, onClick }) => {
    return (
      <div
        className="flex flex-col items-center justify-center py-12 text-center"
        onClick={(e) => onClick?.(pickClick(e))}
      >
        <InboxIcon className="size-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {description}
          </p>
        )}
        {children && <div className="mt-4">{children}</div>}
      </div>
    );
  },
});
