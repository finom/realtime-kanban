import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { Tabs as ShadcnTabs } from "@/components/ui/tabs";
import { TabsDef } from "./def";

export const TabsRenderer = createAIComponentRenderer({
  def: TabsDef,
  renderer: ({ value, defaultValue, children, onValueChange, generatedId }) => {
    return (
      <ShadcnTabs
        value={value}
        defaultValue={defaultValue}
        onValueChange={(v) => onValueChange?.({ value: v })}
        data-id={generatedId}
      >
        {children}
      </ShadcnTabs>
    );
  },
});
