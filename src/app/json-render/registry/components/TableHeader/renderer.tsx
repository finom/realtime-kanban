import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { TableHeader as ShadcnTableHeader, TableRow, TableHead } from "@/components/ui/table";
import Skeleton from "react-loading-skeleton";
import { TableHeaderDef } from "./def";

export const TableHeaderRenderer = createAIComponentRenderer({
  def: TableHeaderDef,
  renderer: ({ children }) => {
  return <ShadcnTableHeader>{children}</ShadcnTableHeader>;
  },
  placeholder: () => (
      <TableRow>
        <TableHead colSpan={1000}>
          <Skeleton height={16} />
        </TableHead>
      </TableRow>
  ),
});
