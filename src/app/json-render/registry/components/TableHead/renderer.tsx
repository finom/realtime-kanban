import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { TableHead as ShadcnTableHead } from "@/components/ui/table";
import { TableHeadDef } from "./def";

export const TableHeadRenderer = createAIComponentRenderer(TableHeadDef, ({ children }) => {
  return <ShadcnTableHead>{children}</ShadcnTableHead>;
});
