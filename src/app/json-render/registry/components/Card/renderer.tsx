import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { pickClick } from "../../shared";
import {
  Card as ShadcnCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { CardDef } from "./def";

export const CardRenderer = createAIComponentRenderer({
  def: CardDef,
  renderer: ({ title, description, children, onClick, generatedId }) => {
    return (
      <ShadcnCard onClick={(e) => onClick?.(pickClick(e))} data-id={generatedId}>
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
