import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { ChevronDown } from "lucide-react";
import { AccordionItemDef } from "./def";

export const AccordionItemRenderer = createAIComponentRenderer({
  def: AccordionItemDef,
  renderer: ({ title, open = false, children, onToggle, generatedId }) => {
    return (
      <div data-id={generatedId}>
        <button
          type="button"
          className="flex w-full items-center justify-between py-4 px-4 text-sm font-medium transition-all hover:underline"
          onClick={() => onToggle?.({ open: !open })}
        >
          {title}
          <ChevronDown
            className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open && (
          <div className="px-4 pb-4 text-sm">
            {children}
          </div>
        )}
      </div>
    );
  },
});
