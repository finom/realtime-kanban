import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { Badge as ShadcnBadge } from "@/components/ui/badge";
import { BadgeDef } from "./def";

export const BadgeRenderer = createAIComponentRenderer({
  def: BadgeDef,
  renderer: ({ children, variant = "default", generatedId }) => {
    return (
      <ShadcnBadge variant={variant} data-id={generatedId}>
        {String(children ?? "")}
      </ShadcnBadge>
    );
  },
});
