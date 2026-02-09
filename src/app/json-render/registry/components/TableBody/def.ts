import z from "zod";
import { createAIComponentDef } from "../../../createAIComponentDef";

export const TableBodyDef = createAIComponentDef({
  description:
    "The body section of a Table. Must be a direct child of Table, after TableHeader. Children should be TableRow components (often rendered as a list). Renders a <tbody> element.",
  propDefs: z.strictObject({}),
});
