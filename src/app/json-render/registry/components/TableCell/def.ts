import z from "zod";
import { createAIComponentDef } from "../../../createAIComponentDef";

export const TableCellDef = createAIComponentDef({
  description:
    "A data cell in a table row. Must be a child of a TableRow inside TableBody or TableFooter. Renders a <td> element. Can display text via children prop or contain child components (Input, Button, Badge, etc.).",
  propDefs: z.strictObject({
    children: z
      .any()
      .optional()
      .meta({ description: "The cell content text or value" }),
  }),
});
