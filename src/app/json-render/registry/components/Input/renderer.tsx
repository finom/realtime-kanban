import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { Input as ShadcnInput } from "@/components/ui/input";
import { InputDef } from "./def";

export const InputRenderer = createAIComponentRenderer({
  def: InputDef,
  renderer: ({
  value,
  type = "text",
  placeholder,
  disabled = false,
  onChange,
}) => {
  return (
    <ShadcnInput
      type={type}
      value={value as string | number | readonly string[] | undefined}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e) =>
        onChange?.({
          value: e.target.value,
          valueAsNumber: e.target.valueAsNumber || 0,
        })
      }
    />
  );
  },
});
