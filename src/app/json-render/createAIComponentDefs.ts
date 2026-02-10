import type { AIComponentDef } from "./createAIComponentDef";
import { JSONSchemaToTs } from "./JSONSchemaToTs";

export const createAIComponentDefs = <T extends Record<string, AIComponentDef>>(
  defs: T,
) => {
  function getDefPartialPrompt() {
    return (
      "# AVAILABLE COMPONENTS:\n" +
      Object.keys(defs)
        .map((key) => key)
        .join(", ") +
      "\n\n# COMPONENT DETAILS:\n" +
      Object.entries(defs)
        .map(([name, { description, propDefs, callbackDefs }]) => {
          const propDefsJSONSchema = propDefs["~standard"].jsonSchema.input({
            target: "draft-2020-12",
          });
          const propDefTs = JSONSchemaToTs(propDefsJSONSchema);
          const callbackSubPrompt = Object.entries(callbackDefs || {})
            .map(([cbName, cbDef]) => {
              const cbDefJSONSchema = cbDef["~standard"].jsonSchema.input({
                target: "draft-2020-12",
              });
              const cbDefTs = JSONSchemaToTs(cbDefJSONSchema);
              return `  - ${cbName}: ${cbDefTs}`;
            })
            .join("\n");
          return `- ${name}: ${propDefTs} - ${description}; ${callbackSubPrompt ? `Event handlers:\n${callbackSubPrompt}` : ""}`;
        })
        .join("\n")
    );
  }

  return {
    defs,
    getDefPartialPrompt,
  };
};
