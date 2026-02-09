import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { TableHeader as ShadcnTableHeader } from "@/components/ui/table";
import { TableHeaderDef } from "./def";

export const TableHeaderRenderer = createAIComponentRenderer(TableHeaderDef, ({ children }) => {
  return <ShadcnTableHeader>{children}</ShadcnTableHeader>;
});
