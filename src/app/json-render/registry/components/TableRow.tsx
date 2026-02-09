import z from "zod";
import { createAIComponent } from "../../createAIComponent";
import { TableRow as ShadcnTableRow } from "@/components/ui/table";
import { onClickSchema, pickClick } from "../shared";

export const TableRow = createAIComponent({
  description:
    "A row in a Table. Must be a child of TableHeader, TableBody, or TableFooter. Children should be TableHead (in header) or TableCell (in body/footer) components. Renders a <tr> element.",
  propDefs: z.strictObject({}),
  callbackDefs: {
    onClick: onClickSchema,
  },
  render: ({ children, onClick }) => {
    return (
      <ShadcnTableRow onClick={(e) => onClick?.(pickClick(e))}>
        {children}
      </ShadcnTableRow>
    );
  },
});
