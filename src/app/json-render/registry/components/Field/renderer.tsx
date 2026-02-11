import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { FieldDef } from "./def";

export const FieldRenderer = createAIComponentRenderer({
  def: FieldDef,
  renderer: ({ disabled = false, children, generatedId }) => {
    return (
      <div
        className="flex flex-col gap-2"
        data-disabled={disabled || undefined}
        data-id={generatedId}
      >
        {children}
      </div>
    );
  },
});
