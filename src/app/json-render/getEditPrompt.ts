import INSTRUCTIONS from "./INSTRUCTIONS.json" assert { type: "json" };
import { getPartialFnPrompt } from "./evaluate";
import { componentDefs } from "./registry/defs";
import type { ChunkComponent } from "./types";
import {
  buildElementTreeSummary,
  extractSubtree,
  findParent,
} from "./promptUtils";

/**
 * Build a targeted prompt for element-level editing.
 * Includes full instructions (AI needs them for correct output),
 * the complete existing UI as JSONL, and focused context about the target element.
 */
export function getEditPrompt({
  editElementId,
  existingLines,
  prompt,
}: {
  editElementId: string;
  existingLines: ChunkComponent[];
  prompt: string;
}) {
  const targetElement = existingLines.find((l) => l.id === editElementId);
  const parentElement = findParent(editElementId, existingLines);
  const subtree = extractSubtree(editElementId, existingLines);

  return `${INSTRUCTIONS}

${getPartialFnPrompt()}

${componentDefs.getDefPartialPrompt()}

# Edit Mode - Targeted Element Replacement

You are editing an EXISTING UI. The user selected a specific element to modify.

## Complete Existing UI (JSONL)
${existingLines.map((line) => JSON.stringify(line)).join("\n")}

## Existing UI Tree Structure
${buildElementTreeSummary(existingLines)}

## Target Element
The user clicked on element with id: "${editElementId}"
${targetElement ? `Element details: ${JSON.stringify(targetElement, null, 2)}` : `(Element not found in current lines)`}

${
  parentElement
    ? `Parent element: [${parentElement.id}] ${parentElement.component} (children: ${parentElement.children?.join(", ")})`
    : "This element has no parent (or is the root)."
}

## Target Element Subtree
${subtree.map((line) => JSON.stringify(line)).join("\n")}

## User's Edit Request
"${prompt}"

## Edit Instructions
- Analyze the edit request and determine the minimal set of chunks to re-emit.
- You may decide to re-emit:
  - The target element itself (if only its props/callbacks need changing)
  - The target element's parent (if the edit requires restructuring siblings)
  - The target element's children (if only inner content needs changing)
- Use the Partial Replacement rules (Rule 11): re-emit a chunk with the SAME \`id\` to replace it and its entire subtree.
- After the re-emitted chunk, emit all its new children (and their descendants) with \`op: "child"\`.
- Emit ONLY the chunks that need to change. Do NOT re-emit the entire tree.
- ALL emitted chunks must have \`op: "child"\` (they are replacements within an existing tree, never a new root).
- Preserve all existing state and structure that doesn't need to change.
- Do NOT emit any text or commentary, only valid JSONL.`;
}
