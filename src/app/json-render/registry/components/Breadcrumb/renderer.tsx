import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { ChevronRight } from "lucide-react";
import { BreadcrumbDef } from "./def";

export const BreadcrumbRenderer = createAIComponentRenderer({
  def: BreadcrumbDef,
  renderer: ({ items = [], onNavigate, generatedId }) => {
    return (
      <nav aria-label="Breadcrumb" data-id={generatedId}>
        <ol className="flex items-center gap-1.5 text-sm">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            const isActive = item.active ?? isLast;
            return (
              <li key={i} className="flex items-center gap-1.5">
                {i > 0 && (
                  <ChevronRight className="size-3.5 text-muted-foreground" />
                )}
                {isActive ? (
                  <span className="font-medium text-foreground">
                    {item.label}
                  </span>
                ) : (
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() =>
                      onNavigate?.({ index: i, label: item.label })
                    }
                  >
                    {item.label}
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  },
});
