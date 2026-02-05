// components/registry.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { type CatalogProps } from "./catalog";

// Type for the registry components
type RegistryComponent<K extends keyof CatalogProps> = React.FC<{
  element: { props: CatalogProps[K] };
  children?: React.ReactNode;
  onAction?: (action: string, params?: Record<string, unknown>) => void;
  data?: Record<string, unknown>;
}>;

// Helper to get value from data using path like "/form/email"
const getValueByPath = (
  data: Record<string, unknown>,
  path: string,
): unknown => {
  const keys = path.replace(/^\//, "").split("/");
  return keys.reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, data);
};

// Type-safe registry
type Registry = {
  [K in keyof CatalogProps]: RegistryComponent<K>;
};

export const registry: Registry = {
  Button: ({ element, children, onAction }) => (
    <Button
      variant={element.props.variant}
      size={element.props.size}
      disabled={element.props.disabled}
    >
      {children}
    </Button>
  ),

  Card: ({ children }) => <Card>{children}</Card>,

  Input: ({ element, data }) => {
    const value = data ? getValueByPath(data, element.props.valuePath) : "";

    return (
      <Input
        type={element.props.type ?? "text"}
        placeholder={element.props.placeholder}
        disabled={element.props.disabled}
        value={typeof value === "string" ? value : ""}
        onChange={() => {
          // Handle through DataProvider's update mechanism
        }}
      />
    );
  },
};
