import z from "zod";
import { createAIComponent } from "../../createAIComponent";
import { Button as ShadcnButton } from "@/components/ui/button";
import { onClickSchema, pickClick } from "../shared";

export const Button = createAIComponent({
  description:
    "A clickable button for triggering actions. Supports multiple visual variants and sizes. Use Button for form submissions, actions, navigation triggers, or any interactive click target. The children prop sets the button label text.",
  propDefs: z.strictObject({
    children: z.any().optional().meta({ description: "The button label text" }),
    variant: z
      .enum(["default", "destructive", "outline", "secondary", "ghost", "link"])
      .default("default")
      .meta({
        description:
          "Visual variant: default (primary filled), destructive (red), outline (bordered), secondary (gray), ghost (transparent), link (underlined text)",
      }),
    size: z.enum(["default", "sm", "lg", "icon"]).default("default").meta({
      description:
        "Button size: default, sm (small), lg (large), icon (square icon button)",
    }),
    disabled: z
      .boolean()
      .default(false)
      .meta({ description: "Whether the button is disabled" }),
  }),
  callbackDefs: {
    onClick: onClickSchema,
  },
  render: ({
    children,
    variant = "default",
    size = "default",
    disabled = false,
    onClick,
  }) => {
    return (
      <ShadcnButton
        variant={variant}
        size={size}
        disabled={disabled}
        onClick={(e) => onClick?.(pickClick(e))}
      >
        {children}
      </ShadcnButton>
    );
  },
});
