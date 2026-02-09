import z from "zod";
import { createAIComponent } from "../../createAIComponent";
import { Table as ShadcnTable } from "@/components/ui/table";

export const Table = createAIComponent({
  description:
    "A table container for displaying tabular data. Children must be TableHeader, TableBody, and optionally TableFooter components in that order. Use Table for any structured data display (user lists, product inventories, reports, etc.).",
  propDefs: z.strictObject({}),
  render: ({ children }) => {
    return <ShadcnTable>{children}</ShadcnTable>;
  },
});
