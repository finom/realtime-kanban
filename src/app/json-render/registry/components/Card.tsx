import z from "zod";
import { createAIComponent } from "../../createAIComponent";
import { onClickSchema, pickClick } from "../shared";
import {
  Card as ShadcnCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export const Card = createAIComponent({
  description:
    "A container component with rounded corners, shadow, and border for grouping related content. Can contain any children components. Optionally displays a title and description in a header area. Use Card to visually group related UI elements such as forms, stats, or content sections.",
  propDefs: z.strictObject({
    title: z
      .string()
      .optional()
      .meta({ description: "Optional header title text" }),
    description: z
      .string()
      .optional()
      .meta({ description: "Optional description text shown below the title" }),
  }),
  callbackDefs: {
    onClick: onClickSchema,
  },
  render: ({ title, description, children, onClick }) => {
    return (
      <ShadcnCard onClick={(e) => onClick?.(pickClick(e))}>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>{children}</CardContent>
      </ShadcnCard>
    );
  },
});
