import { ReactNode } from "react";
import z from "zod";

import { ChunkComponent } from "./types";
import { parseScope } from "./utils";
import { evaluate } from "./evaluate";

type CallbacksToFunctions<T extends Record<string, z.ZodTypeAny>> = {
  [K in keyof T]: (args: z.infer<T[K]>) => void;
};
export const createAIComponent = <
  TProps extends z.ZodObject<any, any>,
  TCallbacks extends Record<string, z.ZodTypeAny>,
>(config: {
  propDefs: TProps;
  callbacks?: TCallbacks;
  description?: string;
  render: (
    props: { children?: ReactNode } & z.infer<TProps> &
      CallbacksToFunctions<TCallbacks>,
  ) => React.ReactElement;
  scopes?: object[];
}) => {
  return (myprops: {
    chunk: ChunkComponent;
    children: ReactNode;
    scopes: Record<string, any>;
  }) => {
    const { chunk, children } = myprops;
    const props: z.infer<TProps> = chunk.props
      ? (evaluate(chunk.props, {
          scopes: myprops.scopes,
        }) as z.infer<TProps>)
      : ({} as z.infer<TProps>);
    const chunkCallbacks = chunk.callbacks ? chunk.callbacks : {};
    const callbacks = Object.fromEntries(
      Object.keys(chunkCallbacks).map((key) => [
        key,
        /* (evt: any) => {
          let result: unknown;

          for (const cbc of chunkCallbacks[key]) {
            result = cbc.expr
              ? evaluate(cbc.expr, { evt, scopes: myprops.scopes })
              : 'literal' in cbc ? cbc.literal : evt.value;
            if (cbc.set) {
              const [targetScope, targetPath] = parseScope(cbc.set);
              myprops.scopes[targetScope].$set(targetPath, result);
            }
          }

          return result;
        }, */
        (evt: any) => {
          let delay = 0;

          for (const cbc of chunkCallbacks[key]) {
            setTimeout(() => {
              const result = cbc.expr
                ? evaluate(cbc.expr, { evt, scopes: myprops.scopes })
                : "literal" in cbc ? cbc.literal : evt.value;
              if (cbc.set) {
                const [targetScope, targetPath] = parseScope(cbc.set);
                myprops.scopes[targetScope].$set(targetPath, result);
              }
            }, delay);
            delay++;
          }
        },
      ]),
    ) as CallbacksToFunctions<TCallbacks>;

    // Spread props first, then let React children override props.children if present
    return config.render({
      ...props,
      ...(children ? { children } : {}),
      ...callbacks,
    });
  };
};
