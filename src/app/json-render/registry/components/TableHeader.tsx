import z from "zod";
import { createAIComponent } from "../../createAIComponent";
import { TableHeader as ShadcnTableHeader } from "@/components/ui/table";

export const TableHeader = createAIComponent({
  description:
    "The header section of a Table. Must be a direct child of Table. Children should be a single TableRow containing TableHead cells. Renders a <thead> element.",
  propDefs: z.strictObject({}),
  render: ({ children }) => {
    return <ShadcnTableHeader>{children}</ShadcnTableHeader>;
  },
});
