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
        ? "left-0 right-auto rounded-r-lg rounded-l-none"
        : "right-0 left-auto rounded-l-lg rounded-r-none";
    return (
      <span data-id={generatedId}>
        <Dialog open={open} onOpenChange={(v) => onOpenChange?.({ open: v })}>
          <DialogContent
            className={`fixed top-0 h-full max-h-full w-80 max-w-sm sm:max-w-sm translate-x-0 translate-y-0 rounded-none ${sideClass} overflow-y-auto data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right data-[state=open]:zoom-in-100 data-[state=closed]:zoom-out-100`}
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
