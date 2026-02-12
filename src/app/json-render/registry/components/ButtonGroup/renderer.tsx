import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { ButtonGroupDef } from "./def";

export const ButtonGroupRenderer = createAIComponentRenderer({
  def: ButtonGroupDef,
  renderer: ({ attached = true, children, generatedId }) => {
    return (
      <div
        className={
          attached
            ? "inline-flex [&>*]:rounded-none [&>*:first-child]:rounded-l-md [&>*:last-child]:rounded-r-md [&>*:not(:first-child)]:-ml-px"
            : "inline-flex gap-2"
        }
        role="group"
        data-id={generatedId}
      >
        {children}
      </div>
    );
  },
});
