import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { Tabs as ShadcnTabs } from "@/components/ui/tabs";
import { TabsDef } from "./def";

export const TabsRenderer = createAIComponentRenderer(TabsDef, ({ value, defaultValue, children, onValueChange }) => {
  return (
    <ShadcnTabs
      value={value}
      defaultValue={defaultValue}
      onValueChange={(v) => onValueChange?.({ value: v })}
    >
      {children}
    </ShadcnTabs>
  );
});
