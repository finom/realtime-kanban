import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { X, CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";
import { ToastDef } from "./def";

export const ToastRenderer = createAIComponentRenderer({
  def: ToastDef,
  renderer: ({
    open = false,
    title,
    description,
    variant = "default",
    position = "bottom-right",
    onClose,
    generatedId,
  }) => {
    if (!open) return <span data-id={generatedId} />;

    const positionMap: Record<string, string> = {
      "top-right": "top-4 right-4",
      "top-left": "top-4 left-4",
      "bottom-right": "bottom-4 right-4",
      "bottom-left": "bottom-4 left-4",
    };

    const variantStyles: Record<string, string> = {
      default: "bg-background border",
      success: "bg-background border border-green-500/30",
      error: "bg-background border border-red-500/30",
      warning: "bg-background border border-yellow-500/30",
    };

    const iconMap: Record<string, React.ReactNode> = {
      default: null,
      success: <CheckCircle2 className="size-4 text-green-500 shrink-0" />,
      error: <AlertCircle className="size-4 text-red-500 shrink-0" />,
      warning: <AlertTriangle className="size-4 text-yellow-500 shrink-0" />,
    };

    return (
      <div
        className={`fixed z-50 ${positionMap[position]} ${variantStyles[variant]} rounded-md shadow-lg p-4 max-w-sm animate-in slide-in-from-bottom-2`}
        data-id={generatedId}
      >
        <div className="flex items-start gap-3">
          {iconMap[variant]}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">{title}</p>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            className="shrink-0 rounded-md p-1 hover:bg-accent"
            onClick={() => onClose?.({})}
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    );
  },
});
