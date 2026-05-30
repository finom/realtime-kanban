import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { TableHead as ShadcnTableHead } from "@/components/ui/table";
import Skeleton from "react-loading-skeleton";
import { TableHeadDef } from "./def";

export const TableHeadRenderer = createAIComponentRenderer({
  def: TableHeadDef,
  renderer: ({ children, generatedId }) => {
    return <ShadcnTableHead data-id={generatedId}>{children}</ShadcnTableHead>;
  },
});
