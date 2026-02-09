import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import {
  DropdownMenu as ShadcnDropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenuDef } from "./def";

export const DropdownMenuRenderer = createAIComponentRenderer(DropdownMenuDef, ({ triggerLabel, children }) => {
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
});
