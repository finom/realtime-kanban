import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { AccordionDef } from "./def";

export const AccordionRenderer = createAIComponentRenderer({
  def: AccordionDef,
  renderer: ({ children, generatedId }) => {
    return (
      <div className="divide-y divide-border rounded-md border" data-id={generatedId}>
        {children}
      </div>
    );
  },
});
