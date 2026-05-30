import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ConfirmDialogDef } from "./def";

export const ConfirmDialogRenderer = createAIComponentRenderer({
  def: ConfirmDialogDef,
  renderer: ({
    open = false,
    title = "Are you sure?",
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "default",
    onConfirm,
    onCancel,
    generatedId,
  }) => {
    return (
      <span data-id={generatedId}>
        <Dialog open={open} onOpenChange={(v) => !v && onCancel?.({})}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => onCancel?.({})}>
                {cancelLabel}
              </Button>
              <Button variant={variant} onClick={() => onConfirm?.({})}>
                {confirmLabel}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </span>
    );
  },
});
