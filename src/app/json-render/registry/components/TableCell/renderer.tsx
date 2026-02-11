import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { TableCell as ShadcnTableCell } from "@/components/ui/table";
import Skeleton from "react-loading-skeleton";
import { TableCellDef } from "./def";

export const TableCellRenderer = createAIComponentRenderer({
  def: TableCellDef,
  renderer: ({ children, generatedId }) => {
    return <ShadcnTableCell data-id={generatedId}>{children}</ShadcnTableCell>;
  },
});
