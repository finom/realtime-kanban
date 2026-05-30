import { useState, useEffect } from "react";
import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { ChevronDown } from "lucide-react";
import { AccordionItemDef } from "./def";

export const AccordionItemRenderer = createAIComponentRenderer({
  def: AccordionItemDef,
  renderer: ({ title, open = false, children, onToggle, generatedId }) => {
    const [isOpen, setIsOpen] = useState(open);

    useEffect(() => {
      setIsOpen(open);
    }, [open]);

    const handleToggle = () => {
      const newOpen = !isOpen;
      setIsOpen(newOpen);
      onToggle?.({ open: newOpen });
    };

    return (
      <div data-id={generatedId}>
        <button
          type="button"
          className="flex w-full items-center justify-between py-4 px-4 text-sm font-medium transition-all hover:underline"
          onClick={handleToggle}
        >
          {title}
          <ChevronDown
            className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
        {isOpen && (
          <div className="px-4 pb-4 text-sm">
            {children}
          </div>
        )}
      </div>
    );
  },
});
