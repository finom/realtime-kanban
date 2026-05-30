import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipDef } from "./def";

export const TooltipRenderer = createAIComponentRenderer({
  def: TooltipDef,
  renderer: ({ content, side = "top", children, generatedId }) => {
    return (
      <TooltipProvider data-id={generatedId}>
        <ShadcnTooltip>
          <TooltipTrigger asChild>
            <span data-id={generatedId}>{children}</span>
          </TooltipTrigger>
          <TooltipContent side={side}>
            <p>{content}</p>
          </TooltipContent>
        </ShadcnTooltip>
      </TooltipProvider>
    );
  },
});
