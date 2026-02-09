import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { TableRow as ShadcnTableRow } from "@/components/ui/table";
import { pickClick } from "../../shared";
import { TableRowDef } from "./def";

export const TableRowRenderer = createAIComponentRenderer(TableRowDef, ({ children, onClick }) => {
  return (
    <ShadcnTableRow onClick={(e) => onClick?.(pickClick(e))}>
      {children}
    </ShadcnTableRow>
  );
});
