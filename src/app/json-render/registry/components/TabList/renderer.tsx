import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { TabsList } from "@/components/ui/tabs";
import Skeleton from "react-loading-skeleton";
import { TabListDef } from "./def";

export const TabListRenderer = createAIComponentRenderer({
  def: TabListDef,
  renderer: ({ children }) => {
  return <TabsList>{children}</TabsList>;
  },
  placeholder: () => (
    <>
      <Skeleton width={60} height={20} />
      <Skeleton width={60} height={20} />
      <Skeleton width={60} height={20} />
    </>
  ),
});
