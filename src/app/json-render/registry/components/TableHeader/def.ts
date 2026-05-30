import z from "zod";
import { createAIComponentDef } from "../../../createAIComponentDef";

export const TableHeaderDef = createAIComponentDef({
  description:
    "The header section of a Table. Must be a direct child of Table. Children should be a single TableRow containing TableHead cells. Renders a <thead> element.",
  propDefs: z.strictObject({}),
});
