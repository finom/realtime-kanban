import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ModalDef } from "./def";

export const ModalRenderer = createAIComponentRenderer(ModalDef, ({ open = false, title, description, children, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={(v) => onOpenChange?.({ open: v })}>
      <DialogContent>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
});
