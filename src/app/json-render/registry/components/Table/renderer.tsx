import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { Table as ShadcnTable } from "@/components/ui/table";
import { TableDef } from "./def";

export const TableRenderer = createAIComponentRenderer(TableDef, ({ children }) => {
  return <ShadcnTable>{children}</ShadcnTable>;
});
