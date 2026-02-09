import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { Skeleton as ShadcnSkeleton } from "@/components/ui/skeleton";
import { SkeletonDef } from "./def";

export const SkeletonRenderer = createAIComponentRenderer(SkeletonDef, ({ width = "100%", height = "1.25rem", rounded = "md" }) => {
  const radiusMap: Record<string, string> = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };
  return (
    <ShadcnSkeleton
      className={radiusMap[rounded]}
      style={{ width, height }}
    />
  );
});
