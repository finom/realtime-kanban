import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { TableBody as ShadcnTableBody } from "@/components/ui/table";
import { TableBodyDef } from "./def";

export const TableBodyRenderer = createAIComponentRenderer(TableBodyDef, ({ children }) => {
  return <ShadcnTableBody>{children}</ShadcnTableBody>;
});
