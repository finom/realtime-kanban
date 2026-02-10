import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { DropdownMenuItem as ShadcnDropdownMenuItem } from "@/components/ui/dropdown-menu";
import { pickClick } from "../../shared";
import { DropdownMenuItemDef } from "./def";

export const DropdownMenuItemRenderer = createAIComponentRenderer({
  def: DropdownMenuItemDef,
  renderer: ({ children, variant = "default", disabled = false, onClick }) => {
    return (
      <ShadcnDropdownMenuItem
        variant={variant}
        disabled={disabled}
        onClick={(e) => onClick?.(pickClick(e))}
      >
        {children}
      </ShadcnDropdownMenuItem>
    );
  },
});
