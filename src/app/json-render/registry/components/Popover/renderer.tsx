import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { Button } from "@/components/ui/button";
import { PopoverDef } from "./def";

export const PopoverRenderer = createAIComponentRenderer({
  def: PopoverDef,
  renderer: ({
    open = false,
    triggerLabel,
    children,
    onOpenChange,
    generatedId,
  }) => {
    return (
      <div className="relative inline-block" data-id={generatedId}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpenChange?.({ open: !open })}
        >
          {triggerLabel ?? "More"}
        </Button>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => onOpenChange?.({ open: false })}
            />
            <div className="absolute z-50 mt-2 min-w-[200px] rounded-md border bg-popover p-4 shadow-md">
              {children}
            </div>
          </>
        )}
      </div>
    );
  },
});
