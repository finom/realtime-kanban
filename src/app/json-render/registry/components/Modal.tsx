import z from "zod";
import { createAIComponent } from "../../createAIComponent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Modal = createAIComponent({
  description:
    "A modal dialog overlay that appears on top of the page content. Controlled by the 'open' prop. Contains a title, optional description, and any children components in the body. Use Modal for forms, detail views, confirmations, or any content that requires user focus. Use the 'hidden' chunk property or the 'open' prop to control visibility. The onOpenChange callback fires when the user closes the modal (clicks overlay or X button).",
  propDefs: z.strictObject({
    open: z
      .boolean()
      .default(false)
      .meta({ description: "Whether the modal is open/visible" }),
    title: z
      .string()
      .optional()
      .meta({ description: "The modal header title" }),
    description: z
      .string()
      .optional()
      .meta({ description: "Optional description text below the title" }),
  }),
  callbackDefs: {
    onOpenChange: z
      .object({
        open: z
          .boolean()
          .meta({
            description: "The new open state (typically false when closing)",
          }),
      })
      .meta({
        description:
          "Callback when the modal open state changes (e.g. user clicks close)",
      }),
  },
  render: ({ open = false, title, description, children, onOpenChange }) => {
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
  },
});
