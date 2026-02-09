import z from "zod";
import { createAIComponent } from "../../createAIComponent";
import { TableCell as ShadcnTableCell } from "@/components/ui/table";

export const TableCell = createAIComponent({
  description:
    "A data cell in a table row. Must be a child of a TableRow inside TableBody or TableFooter. Renders a <td> element. Can display text via children prop or contain child components (Input, Button, Badge, etc.).",
  propDefs: z.strictObject({
    children: z
      .any()
      .optional()
      .meta({ description: "The cell content text or value" }),
  }),
  render: ({ children }) => {
    return <ShadcnTableCell>{children}</ShadcnTableCell>;
  },
});
