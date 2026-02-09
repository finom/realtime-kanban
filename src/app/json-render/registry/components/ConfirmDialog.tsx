import z from "zod";
import { createAIComponent } from "../../createAIComponent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const ConfirmDialog = createAIComponent({
  description:
    "A confirmation dialog that asks the user to confirm or cancel an action. Shows a title, description, and Confirm/Cancel buttons. Use ConfirmDialog for destructive actions like deleting items, or any action requiring user confirmation before proceeding.",
  propDefs: z.strictObject({
    open: z
      .boolean()
      .default(false)
      .meta({ description: "Whether the dialog is open/visible" }),
    title: z
      .string()
      .default("Are you sure?")
      .meta({ description: "The confirmation dialog title" }),
    description: z
      .string()
      .optional()
      .meta({ description: "Explanatory text about what will happen" }),
    confirmLabel: z
      .string()
      .default("Confirm")
      .meta({ description: "Label for the confirm button" }),
    cancelLabel: z
      .string()
      .default("Cancel")
      .meta({ description: "Label for the cancel button" }),
    variant: z.enum(["default", "destructive"]).default("default").meta({
      description:
        "Button style for confirm: default (primary blue) or destructive (red, for dangerous actions)",
    }),
  }),
  callbackDefs: {
    onConfirm: z
      .object({})
      .meta({
        description: "Callback when the user clicks the confirm button",
      }),
    onCancel: z
      .object({})
      .meta({
        description:
          "Callback when the user clicks cancel or closes the dialog",
      }),
  },
  render: ({
    open = false,
    title = "Are you sure?",
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "default",
    onConfirm,
    onCancel,
  }) => {
    return (
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
    );
  },
});
