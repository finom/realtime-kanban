import type { CombinedSpec } from "./types";

export const createAIComponentDef = <
  TProps extends CombinedSpec,
  TCallbacks extends Record<string, CombinedSpec> = Record<string, never>,
>({
  propDefs,
  callbackDefs,
  description,
}: {
  propDefs: TProps;
  callbackDefs?: TCallbacks;
  description: string;
}) => {
  return { propDefs, callbackDefs, description };
};

export type AIComponentDef = ReturnType<typeof createAIComponentDef>;
