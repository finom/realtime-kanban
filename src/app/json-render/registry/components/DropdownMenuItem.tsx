import z from "zod";
import { createAIComponent } from "../../createAIComponent";
import { DropdownMenuItem as ShadcnDropdownMenuItem } from "@/components/ui/dropdown-menu";
import { onClickSchema, pickClick } from "../shared";

export const DropdownMenuItem = createAIComponent({
  description:
    "A single item/action inside a DropdownMenu. Must be a child of DropdownMenu. Use DropdownMenuItem for each action option in the dropdown (Edit, Delete, View, etc.).",
  propDefs: z.strictObject({
    children: z
      .any()
      .optional()
      .meta({ description: "The menu item label text" }),
    variant: z.enum(["default", "destructive"]).default("default").meta({
      description:
        "Visual variant: default or destructive (red, for dangerous actions like Delete)",
    }),
    disabled: z
      .boolean()
      .default(false)
      .meta({ description: "Whether the menu item is disabled" }),
  }),
  callbackDefs: {
    onClick: onClickSchema,
  },
  render: ({ children, variant = "default", disabled = false, onClick }) => {
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
