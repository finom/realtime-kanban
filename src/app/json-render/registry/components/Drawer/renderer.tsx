import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DrawerDef } from "./def";

export const DrawerRenderer = createAIComponentRenderer({
  def: DrawerDef,
  renderer: ({
    open = false,
    title,
    description,
    side = "right",
    children,
    onOpenChange,
    generatedId,
  }) => {
    const sideClass =
      side === "left"
        ? "left-0 rounded-r-lg rounded-l-none"
        : "right-0 rounded-l-lg rounded-r-none";
    return (
      <span data-id={generatedId}>
        <Dialog open={open} onOpenChange={(v) => onOpenChange?.({ open: v })}>
          <DialogContent
            className={`fixed top-0 h-full max-h-full w-80 max-w-sm translate-x-0 ${sideClass} overflow-y-auto`}
          >
            {(title || description) && (
              <DialogHeader>
                {title && <DialogTitle>{title}</DialogTitle>}
                {description && (
                  <DialogDescription>{description}</DialogDescription>
                )}
              </DialogHeader>
            )}
            <div className="flex-1 overflow-y-auto">{children}</div>
          </DialogContent>
        </Dialog>
      </span>
    );
  },
});
