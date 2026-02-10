import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectDef } from "./def";

export const SelectRenderer = createAIComponentRenderer({
  def: SelectDef,
  renderer: ({
    value,
    placeholder,
    options = [],
    disabled = false,
    onChange,
  }) => {
    return (
      <ShadcnSelect
        value={value}
        disabled={disabled}
        onValueChange={(v) => onChange?.({ value: v })}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder ?? "Select..."} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </ShadcnSelect>
    );
  },
});
