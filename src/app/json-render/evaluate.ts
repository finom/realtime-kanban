import { Environment } from "@marcbachmann/cel-js";
import { AssignableExpr, ValueExpr } from "./types";
import * as api from "vovk-client";
import { pick } from "lodash";
import { VovkJSONSchemaBase, VovkSchema } from "vovk";
import { JSONSchemaToTs } from "./JSONSchemaToTs";
import { VovkHandlerSchema } from "vovk/internal";

const celEnv = new Environment()
  .registerVariable("scopes", "dyn")
  .registerVariable("evt", "dyn");
// Simple 2-arg reduce: sums a list with an initial value
// Usage: reduce(myList.map(x, x.value), 0.0)

// reduce(list, initialValue, accVar, itemVar, expression)
// Example: reduce(myList, 0, acc, item, acc + item.x)
// All args are AST nodes at parse time since "ast" is in the signature.
// We use the {evaluate, typeCheck} macro return form (like cel.bind).
celEnv.registerFunction(
  "reduce(ast, ast, ast, ast, ast): dyn",
  ({ args }: { args: any[] }) => {
    const [listAst, initialAst, accVarAst, itemVarAst, operationAst] = args;

    // Extract identifier names from the AST nodes
    // When op === 'id', args is the variable name string
    if (accVarAst.op !== "id" || itemVarAst.op !== "id") {
      throw new Error(
        "reduce() 3rd and 4th arguments must be identifiers (variable names)",
      );
    }
    const accVarName: string = accVarAst.args;
    const itemVarName: string = itemVarAst.args;

    return {
      listAst,
      initialAst,
      accVarName,
      itemVarName,
      operationAst,
      // Contexts created during typeCheck, reused during evaluate
      accCtx: undefined as any,
      itemCtx: undefined as any,

      typeCheck(checker: any, macro: any, ctx: any) {
        // Type-check the list and initial value in the current context
        const listType = checker.check(macro.listAst, ctx);
        const initialType = checker.check(macro.initialAst, ctx);

        // Fork context: first layer for the accumulator variable
        macro.accCtx = ctx.forkWithVariable(macro.accVarName, initialType);
        // Second layer for the item variable (elem type from list, or dyn)
        const elemType = listType?.elem ?? checker.dynType;
        macro.itemCtx = macro.accCtx.forkWithVariable(
          macro.itemVarName,
          elemType,
        );

        // Type-check the operation expression in the extended context
        checker.check(macro.operationAst, macro.itemCtx);

        return initialType;
      },

      evaluate(ev: any, macro: any, ctx: any) {
        const list = ev.eval(macro.listAst, ctx);
        if (list instanceof Promise) {
          return list.then((resolvedList: any) =>
            runReduce(ev, macro, ctx, resolvedList),
          );
        }
        return runReduce(ev, macro, ctx, list);
      },
    };
  },
);

function runReduce(ev: any, macro: any, ctx: any, list: any[]) {
  if (!Array.isArray(list)) {
    throw new Error(
      "reduce() first argument must be a list, got: " + typeof list,
    );
  }

  const initial = ev.eval(macro.initialAst, ctx);
  if (initial instanceof Promise) {
    return initial.then((resolvedInitial: any) =>
      iterateReduce(ev, macro, ctx, list, resolvedInitial, 0),
    );
  }
  return iterateReduce(ev, macro, ctx, list, initial, 0);
}

function iterateReduce(
  ev: any,
  macro: any,
  ctx: any,
  list: any[],
  acc: any,
  i: number,
): any {
  // Fork context for accumulator and item variables
  // accCtx binds the accumulator variable name
  // itemCtx binds the item variable name on top of accCtx
  const accCtx = macro.accCtx.reuse(ctx).setIterValue(acc);
  const itemCtx = macro.itemCtx.reuse(accCtx);

  while (i < list.length) {
    // Set item value on the inner context
    itemCtx.setIterValue(list[i]);
    acc = ev.eval(macro.operationAst, itemCtx);
    i++;

    if (acc instanceof Promise) {
      // Handle async: when a step returns a Promise, continue asynchronously
      return acc.then((resolvedAcc: any) => {
        // Need fresh contexts for async continuation to avoid mutation issues
        const nextAccCtx = macro.accCtx.reuse(ctx).setIterValue(resolvedAcc);
        const nextItemCtx = macro.itemCtx.reuse(nextAccCtx);
        // Mark as async so reuse() creates new contexts instead of mutating
        macro.accCtx.async = true;
        macro.itemCtx.async = true;
        return iterateReduceAsync(
          ev,
          macro,
          ctx,
          list,
          resolvedAcc,
          i,
          nextAccCtx,
          nextItemCtx,
        );
      });
    }

    // Update accumulator value in context for next iteration
    accCtx.setIterValue(acc);
  }

  return acc;
}

function iterateReduceAsync(
  ev: any,
  macro: any,
  ctx: any,
  list: any[],
  acc: any,
  i: number,
  accCtx: any,
  itemCtx: any,
): any {
  while (i < list.length) {
    accCtx.setIterValue(acc);
    itemCtx.setIterValue(list[i]);
    acc = ev.eval(macro.operationAst, itemCtx);
    i++;

    if (acc instanceof Promise) {
      return acc.then((resolvedAcc: any) => {
        const nextAccCtx = macro.accCtx.reuse(ctx).setIterValue(resolvedAcc);
        const nextItemCtx = macro.itemCtx.reuse(nextAccCtx);
        return iterateReduceAsync(
          ev,
          macro,
          ctx,
          list,
          resolvedAcc,
          i,
          nextAccCtx,
          nextItemCtx,
        );
      });
    }
  }

  return acc;
}

const modules = pick(api, ["UserRPC", "TaskRPC"]);

for (const [moduleName, module] of Object.entries(modules)) {
  for (const [name, func] of Object.entries(module)) {
    if (typeof func !== "function") continue;
    const validation = (func as any).schema.validation ?? {};
    const hasInput =
      "body" in validation || "query" in validation || "params" in validation;
    celEnv.registerFunction(
      `${moduleName}_${name}(${hasInput ? "dyn" : ""}): dyn`,
      (input) => func(input),
    );
  }
}

export function getPartialFnPrompt() {
  return `# CEL (Common Expression Language):
CEL is used for all expressions. Key syntax rules:
- CEL is NOT JavaScript or Python. Do not use arrow functions, lambdas, template literals, let/const, or semicolons.
- Expressions are single expressions only, not statements. No assignments, no variable declarations, no blocks.
- String concatenation uses +: "hello" + " " + name (not template literals).
- Ternary: condition ? trueExpr : falseExpr
- Boolean logic: && (AND), || (OR), ! (NOT). These are the only boolean operators (no "and", "or", "not" keywords).
- Equality: == and !=. No === or !==.
- Field access: object.field, object["field"], list[index].
- No null coalescing (??) or optional chaining (?.) — use has(obj.field) to check existence, or .?field / [?index] for optional access that returns optional<T>.
- List literals: [1, 2, 3]. Map literals: {"key": value}.
- Macros like map, filter, exists use a variable name (not a function): list.map(x, x.field) NOT list.map(x => x.field).
- No spread operator, no destructuring, no import/export.
- Numeric types matter: 1 is int, 1u is uint, 1.0 is double. Use double() or int() to convert when mixing types.
- IMPORTANT: size() and other int-returning functions return BigInt internally. Chart components (PieChart, FunnelChart) require double values. Always use double(size(...)) when passing size() results as numeric chart values.
- IMPORTANT: Never use dyn() wrappers on individual values inside map literals that are inside an array literal (e.g., [{"key": dyn(val)}] will fail with type error). Instead, precompute the array in defaults/callbacks and reference the state variable with dyn() in props.
- CRITICAL: All defaults in a single chunk are evaluated BEFORE any are written. A later default CANNOT read a value set by an earlier default in the same chunk. Split dependent defaults across parent/child chunks.
- Map value types must be consistent: if one value is dyn (e.g., u.fullName from dynamic scope), ALL values must be dyn. Wrap with dyn(): {"name": u.fullName, "value": dyn(double(size(...)))}. If all values are strings, use string() consistently.


Type conversions:
- int(value), uint(value), double(value), string(value), bool(value), bytes(string), dyn(value)
- type(value) - returns the runtime type
- timestamp(string or int), duration(string) - e.g. timestamp("2023-01-01T00:00:00Z"), duration("1h30m")

Size:
- size(string|bytes|list|map): int, or receiver form: value.size()

String methods (receiver):
- .contains(string): bool, .startsWith(string): bool, .endsWith(string): bool
- .matches(regex): bool - RE2 regex test
- .lowerAscii(): string, .upperAscii(): string, .trim(): string
- .indexOf(string, ?offset): int, .lastIndexOf(string, ?offset): int
- .substring(start, ?end): string
- .split(separator, ?limit): list<string>

List/map macros (receiver):
- .map(var, transform): list - e.g. items.map(x, x.name)
- .map(var, filter, transform): list - e.g. items.map(x, x.active, x.name)
- .filter(var, predicate): list - e.g. items.filter(x, x.active)
- .all(var, predicate): bool, .exists(var, predicate): bool, .exists_one(var, predicate): bool
- list<string>.join(?separator): string

Other:
- has(e.field): bool - tests field/key existence
- cel.bind(var, value, expr): dyn - bind a temporary variable
- value in list: bool, key in map: bool - membership test
- Operators: +, -, *, /, %, ==, !=, <, <=, >, >=, &&, ||, !, ?:
- Optional chaining: .?field, [?index], optional.of(value), optional.none(), .hasValue(), .value(), .or(optional), .orValue(default)
- Timestamp methods: .getFullYear(), .getMonth(), .getDate(), .getDayOfWeek(), .getDayOfYear(), .getHours(), .getMinutes(), .getSeconds(), .getMilliseconds() (all accept optional timezone string)
- Duration methods: .getHours(), .getMinutes(), .getSeconds(), .getMilliseconds()

Custom functions:
- reduce(list, initialValue, accVar, itemVar, expression): dyn - reduces a list to a single value. Example: reduce(items, 0, acc, item, acc + item.x)

Custom async functions (called with a single map literal argument matching the TypeScript type shown, e.g. FunctionName({"body": {"id": "abc"}}); functions with no input take no arguments):
${getPartialRPCPrompt()}`;
}

function getPartialRPCPrompt() {
  const items: string[] = [];
  Object.entries(modules).map(([moduleName, module]) => {
    Object.entries(module).forEach(([name, func]) => {
      if (typeof func !== "function") return;
      const schema = (func as any).schema as VovkHandlerSchema;
      const validation = schema.validation ?? {};
      const properties: NonNullable<VovkJSONSchemaBase["properties"]> = {};
      if ("body" in validation) {
        properties.body = validation.body!;
      }
      if ("query" in validation) {
        properties.query = validation.query!;
      }
      if ("params" in validation) {
        properties.params = validation.params!;
      }
      const tsInput = Object.keys(properties).length
        ? JSONSchemaToTs({
            type: "object",
            properties,
            required: Object.keys(properties),
          })
        : "";
      items.push(
        `- ${moduleName}_${name}(${tsInput}): ${"output" in validation ? JSONSchemaToTs(validation.output!) : "void"}; - ${schema.operationObject?.summary}; ${schema.operationObject?.description}`,
      );
    });
  });
  return items.join("\n");
}

export const evaluate = <T extends ValueExpr>(
  expr: T,
  context: Record<string, any>,
): T extends AssignableExpr ? Promise<unknown> : unknown => {
  return expr.literal ?? celEnv.evaluate(expr.expr ?? "null", context);
};
