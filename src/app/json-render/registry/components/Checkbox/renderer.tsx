import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { Checkbox as ShadcnCheckbox } from "@/components/ui/checkbox";
import { CheckboxDef } from "./def";

export const CheckboxRenderer = createAIComponentRenderer({
  def: CheckboxDef,
  renderer: ({ checked = false, disabled = false, label, onChange, generatedId }) => {
    const id = label
      ? `checkbox-${label.replace(/\s/g, "-").toLowerCase()}`
      : undefined;
    return (
      <div className="flex items-center gap-2" data-id={generatedId}>
        <ShadcnCheckbox
          id={id}
          checked={checked}
          disabled={disabled}
          onCheckedChange={(v) => onChange?.({ checked: v === true })}
        />
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
      </div>
    );
  },
});
