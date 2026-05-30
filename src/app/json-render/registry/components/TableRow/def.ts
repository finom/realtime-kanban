import z from "zod";
import { createAIComponentDef } from "../../../createAIComponentDef";
import { onClickSchema } from "../../shared";

export const TableRowDef = createAIComponentDef({
  description:
    "A row in a Table. Must be a child of TableHeader, TableBody, or TableFooter. Children should be TableHead (in header) or TableCell (in body/footer) components. Renders a <tr> element.",
  propDefs: z.strictObject({}),
  callbackDefs: {
    onClick: onClickSchema,
  },
});
