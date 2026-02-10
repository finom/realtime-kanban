import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import {
  TableFooter as ShadcnTableFooter,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import Skeleton from "react-loading-skeleton";
import { TableFooterDef } from "./def";

export const TableFooterRenderer = createAIComponentRenderer({
  def: TableFooterDef,
  renderer: ({ children }) => {
    return <ShadcnTableFooter>{children}</ShadcnTableFooter>;
  },
  placeholder: () => (
    <TableRow>
      <TableCell colSpan={1000}>
        <Skeleton height={20} />
      </TableCell>
    </TableRow>
  ),
});
