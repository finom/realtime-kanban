import { Activity, type ReactNode } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import type {
  AssignableWithConfirmExpr,
  ChunkComponent,
  CombinedSpec,
  ValueExpr,
} from "./types";
import type { AIComponentDef } from "./createAIComponentDef";
import { parseScope } from "./utils";
import { evaluate } from "./evaluate";
import { useConfirm } from "./ConfirmModal";

type CallbacksToFunctions<T extends Record<string, CombinedSpec>> = {
  [K in keyof T]: (args: CombinedSpec.InferOutput<T[K]>) => Promise<void>;
};

export const DefaultPlaceholder = () => (
  <div className="text-gray-400 italic">
    <Skeleton count={1} />
  </div>
);

export const createAIComponentRenderer = <
  TProps extends CombinedSpec,
  TCallbacks extends Record<string, CombinedSpec>,
>({
  def,
  renderer: render,
  placeholder,
}: {
  def: AIComponentDef & { propDefs: TProps; callbackDefs?: TCallbacks };
  renderer: (
    props: { children?: ReactNode } & CombinedSpec.InferOutput<TProps> &
      CallbacksToFunctions<TCallbacks>,
  ) => React.ReactElement;
  placeholder?: () => React.ReactElement;
}) => {
  const component = (myprops: {
    chunk: ChunkComponent;
    children: ReactNode;
    scopes: Record<string, any>;
  }) => {
    const { chunk, children } = myprops;
    const confirm = useConfirm();
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
            if (setExpr.confirm) {
              const confirmed = await confirm(setExpr.confirm);
              if (!confirmed) return;
            }
            const result = await evaluate<AssignableWithConfirmExpr>(setExpr, {
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

    const result = render({
      ...(props as object),
      ...(children ? { children } : {}),
      ...callbacks,
    });

    if (chunk.hidden) {
      return <Activity mode={hidden ? "hidden" : "visible"}>{result}</Activity>;
    }

    return result;
  };

  return { component, placeholder: placeholder ?? null, ...def };
};

export type AIComponentRenderer = ReturnType<typeof createAIComponentRenderer>;
