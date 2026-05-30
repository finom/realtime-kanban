import z from "zod";
import { createAIComponentDef } from "../../../createAIComponentDef";

export const TableHeadDef = createAIComponentDef({
  description:
    "A header cell in a table row. Must be a child of a TableRow inside a TableHeader. Renders a <th> element. Use the children prop for the column header label text.",
  propDefs: z.strictObject({
    children: z
      .any()
      .optional()
      .meta({ description: "The column header text" }),
  }),
});
