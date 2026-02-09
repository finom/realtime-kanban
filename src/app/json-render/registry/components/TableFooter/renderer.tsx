import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { TableFooter as ShadcnTableFooter } from "@/components/ui/table";
import { TableFooterDef } from "./def";

export const TableFooterRenderer = createAIComponentRenderer(TableFooterDef, ({ children }) => {
  return <ShadcnTableFooter>{children}</ShadcnTableFooter>;
});
