import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { Button as ShadcnButton } from "@/components/ui/button";
import { pickClick } from "../../shared";
import { ButtonDef } from "./def";

export const ButtonRenderer = createAIComponentRenderer({
  def: ButtonDef,
  renderer: ({
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
