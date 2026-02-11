import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { TableRow as ShadcnTableRow, TableCell } from "@/components/ui/table";
import { pickClick } from "../../shared";
import Skeleton from "react-loading-skeleton";
import { TableRowDef } from "./def";

export const TableRowRenderer = createAIComponentRenderer({
  def: TableRowDef,
  renderer: ({ children, onClick, generatedId }) => {
    return (
      <ShadcnTableRow onClick={(e) => onClick?.(pickClick(e))} data-id={generatedId}>
        {children}
      </ShadcnTableRow>
    );
  },
  placeholder: () => (
    <TableCell colSpan={1000}>
      <Skeleton height={20} />
    </TableCell>
  ),
});
