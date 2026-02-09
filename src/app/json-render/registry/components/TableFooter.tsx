import z from "zod";
import { createAIComponent } from "../../createAIComponent";
import { TableFooter as ShadcnTableFooter } from "@/components/ui/table";

export const TableFooter = createAIComponent({
  description:
    "The footer section of a Table. Optional, placed after TableBody. Children should be a TableRow with TableCell elements for totals, summaries, or pagination. Renders a <tfoot> element.",
  propDefs: z.strictObject({}),
  render: ({ children }) => {
    return <ShadcnTableFooter>{children}</ShadcnTableFooter>;
  },
});
