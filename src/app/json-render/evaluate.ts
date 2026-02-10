import { AssignableExpr, ValueExpr } from "./types";
import * as api from "vovk-client";
import { pick } from "lodash";
import { VovkJSONSchemaBase } from "vovk";
import { JSONSchemaToTs } from "./JSONSchemaToTs";
import { VovkHandlerSchema } from "vovk/internal";
import { SafeEval } from "./SafeEval";

const safeEval = new SafeEval({
  allowGlobals: [
    "Array",
    "Object",
    "Math",
    "Date",
    "JSON",
    "String",
    "Number",
    "Boolean",
    "RegExp",
    "parseInt",
    "parseFloat",
    "isNaN",
    "isFinite",
    "undefined",
    "NaN",
    "Infinity",
  ],
});

const modules = pick(api, ["UserRPC", "TaskRPC"]);

// Build a flat map of RPC functions for context injection
const rpcFunctions: Record<string, (...args: unknown[]) => unknown> = {};
for (const [moduleName, module] of Object.entries(modules)) {
  for (const [name, func] of Object.entries(module)) {
    if (typeof func !== "function") continue;
    rpcFunctions[`${moduleName}_${name}`] = func as (
      ...args: unknown[]
    ) => unknown;
  }
}

export function getPartialFnPrompt() {
  return `# JavaScript Expressions:
All \`expr\` values are JavaScript expressions evaluated with a provided context. Key syntax rules:
- Expressions are standard JavaScript expressions (single expression, no statements).
- No variable declarations (let, const, var), no assignments (=, +=), no loops, no if/else statements.
- Arrow functions are allowed for callbacks: \`items.filter(o => o.active)\`
- Template literals are allowed: \`\\\`Hello \${name}\\\`\`
- Ternary operator: \`condition ? trueVal : falseVal\`
- Object literals: when the expression IS an object literal, wrap in parentheses: \`({ key: value })\`
- Array literals: \`[1, 2, 3]\`
- String concatenation: \`"hello" + " " + name\` or template literals.
- Array methods: \`.map()\`, \`.filter()\`, \`.reduce()\`, \`.find()\`, \`.some()\`, \`.every()\`, \`.length\`, \`.includes()\`, \`.indexOf()\`, \`.join()\`, \`.slice()\`, \`.concat()\`, \`.flat()\`, \`.flatMap()\`
- Object methods: \`Object.keys()\`, \`Object.values()\`, \`Object.entries()\`
- Nullish coalescing: \`value ?? defaultValue\`
- Optional chaining: \`obj?.field\`, \`arr?.[0]\`
- Spread operator in arrays/objects: \`[...arr, newItem]\`, \`{ ...obj, key: val }\`
- \`typeof\` operator: \`typeof value === "string"\`
- Logical operators: \`&&\`, \`||\`, \`!\`
- Comparison: \`===\`, \`!==\`, \`<\`, \`<=\`, \`>\`, \`>=\` (prefer strict equality \`===\`)
- Math: \`Math.floor()\`, \`Math.ceil()\`, \`Math.round()\`, \`Math.max()\`, \`Math.min()\`, \`Math.abs()\`
- CRITICAL: All defaults in a single chunk are evaluated BEFORE any are written. A later default CANNOT read a value set by an earlier default in the same chunk. Split dependent defaults across parent/child chunks.

Available context variables:
- \`scopes\` - reactive state object with all scopes
- \`evt\` - event object (in callbacks only)
- All RPC functions listed below are available as async function calls, so they need to be avaited with \`await\`.

Custom async functions (RPC). Each function accepts a single object argument matching the TypeScript type shown. Functions with no input take no arguments:
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
  if (expr.literal !== undefined) return expr.literal as any;
  if (!expr.expr) return null as any;
  return safeEval.eval(expr.expr, { ...context, ...rpcFunctions }) as any;
};
