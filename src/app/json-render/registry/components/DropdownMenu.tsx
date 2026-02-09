import z from "zod";
import { createAIComponent } from "../../createAIComponent";
import {
  DropdownMenu as ShadcnDropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

export const DropdownMenu = createAIComponent({
  description:
    "A dropdown menu triggered by a button click. Renders a trigger button and a popover menu. Children must be DropdownMenuItem components. Use DropdownMenu for action menus, context menus, or any set of actions behind a '...' or similar trigger button.",
  propDefs: z.strictObject({
    triggerLabel: z.string().optional().meta({
      description:
        "Label text for the trigger button. If omitted, renders a '...' icon button",
    }),
  }),
  render: ({ triggerLabel, children }) => {
    return (
      <ShadcnDropdownMenu>
        <DropdownMenuTrigger asChild>
          {triggerLabel ? (
            <Button variant="outline">{triggerLabel}</Button>
          ) : (
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="size-4" />
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">{children}</DropdownMenuContent>
      </ShadcnDropdownMenu>
    );
  },
});
