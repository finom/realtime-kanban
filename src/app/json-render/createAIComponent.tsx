import { Activity, type ReactNode } from "react";
import type {
  AssignableExpr,
  ChunkComponent,
  CombinedSpec,
  ValueExpr,
} from "./types";
import { parseScope } from "./utils";
import { evaluate } from "./evaluate";

type CallbacksToFunctions<T extends Record<string, CombinedSpec>> = {
  [K in keyof T]: (args: CombinedSpec.InferOutput<T[K]>) => Promise<void>;
};
export const createAIComponent = <
  TProps extends CombinedSpec,
  TCallbacks extends Record<string, CombinedSpec>,
>({
  propDefs,
  callbackDefs,
  description,
  render,
}: {
  propDefs: TProps;
  callbackDefs?: TCallbacks;
  description: string;
  render: (
    props: { children?: ReactNode } & CombinedSpec.InferOutput<TProps> &
      CallbacksToFunctions<TCallbacks>,
  ) => React.ReactElement;
  // scopes?: object[];
}) => {
  const component = (myprops: {
    chunk: ChunkComponent;
    children: ReactNode;
    scopes: Record<string, any>;
  }) => {
    const { chunk, children } = myprops;
    const props: CombinedSpec.InferOutput<TProps> = chunk.props
      ? (evaluate<ValueExpr>(chunk.props, {
          scopes: myprops.scopes,
        }) as CombinedSpec.InferOutput<TProps>)
      : ({} as CombinedSpec.InferOutput<TProps>);
    const hidden = chunk.hidden
      ? evaluate<ValueExpr>(chunk.hidden, {
          scopes: myprops.scopes,
        })
      : false;
    const chunkCallbacks = chunk.callbacks ? chunk.callbacks : {};
    const callbacks = Object.fromEntries(
      Object.keys(chunkCallbacks).map((key) => [
        key,
        async (evt: any) => {
          for (const setExpr of chunkCallbacks[key]) {
            const result = await evaluate<AssignableExpr>(setExpr, {
              evt,
              scopes: myprops.scopes,
            });
            if (setExpr.set) {
              const [targetScope, targetPath] = parseScope(setExpr.set);
              myprops.scopes[targetScope].$set(targetPath, result);
            }
            await new Promise((resolve) => setTimeout(resolve, 0));
          }
        },
      ]),
    ) as CallbacksToFunctions<TCallbacks>;

    // Spread props first, then let React children override props.children if present
    const result = render({
      ...(props as object),
      ...(children ? { children } : {}),
      ...callbacks,
    });

    if (chunk.hidden) {
      return <Activity mode={hidden ? "visible" : "hidden"}>{result}</Activity>;
    }

    return result;
  };

  return { component, description, propDefs, callbackDefs };
};
