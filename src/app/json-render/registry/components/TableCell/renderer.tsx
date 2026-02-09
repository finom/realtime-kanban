import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { TableCell as ShadcnTableCell } from "@/components/ui/table";
import { TableCellDef } from "./def";

export const TableCellRenderer = createAIComponentRenderer(TableCellDef, ({ children }) => {
  return <ShadcnTableCell>{children}</ShadcnTableCell>;
});
