import z from "zod";
import { createAIComponent } from "../../createAIComponent";
import { TableBody as ShadcnTableBody } from "@/components/ui/table";

export const TableBody = createAIComponent({
  description:
    "The body section of a Table. Must be a direct child of Table, after TableHeader. Children should be TableRow components (often rendered as a list). Renders a <tbody> element.",
  propDefs: z.strictObject({}),
  render: ({ children }) => {
    return <ShadcnTableBody>{children}</ShadcnTableBody>;
  },
});
