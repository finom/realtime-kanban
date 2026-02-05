import { Environment } from "@marcbachmann/cel-js";

const celEnv = new Environment()
  .registerVariable('scopes', 'dyn')
  .registerVariable('evt', 'dyn')
  .registerFunction('reduce(list, double): double', (arr: number[], initial: number) => 
    arr.reduce((acc, n) => acc + Number(n), Number(initial))
  );

export const evaluate = (expr: string, context: Record<string, any>) => {
  return celEnv.evaluate(expr, context);
};
