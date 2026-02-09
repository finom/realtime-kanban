import z from "zod";
import { createAIComponent } from "../../createAIComponent";
import {
  Alert as ShadcnAlert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  info: <Info className="size-4" />,
  success: <CheckCircle2 className="size-4" />,
  warning: <AlertTriangle className="size-4" />,
  error: <AlertCircle className="size-4" />,
};

export const Alert = createAIComponent({
  description:
    "A feedback alert banner for displaying important messages to the user. Shows an icon, title, and optional description. Use Alert for success messages, error notices, warnings, or informational banners.",
  propDefs: z.strictObject({
    title: z.string().meta({ description: "The alert heading text" }),
    description: z
      .string()
      .optional()
      .meta({
        description: "Optional longer description text below the title",
      }),
    status: z
      .enum(["info", "success", "warning", "error"])
      .default("info")
      .meta({
        description:
          "The alert type determining icon and color: info (blue), success (green), warning (yellow), error (red/destructive)",
      }),
  }),
  render: ({ title, description, status = "info" }) => {
    const variant = status === "error" ? "destructive" : "default";
    return (
      <ShadcnAlert variant={variant}>
        {iconMap[status]}
        <AlertTitle>{title}</AlertTitle>
        {description && <AlertDescription>{description}</AlertDescription>}
      </ShadcnAlert>
    );
  },
});
