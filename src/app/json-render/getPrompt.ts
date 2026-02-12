import INSTRUCTIONS from "./INSTRUCTIONS.json" assert { type: "json" };
import { getPartialFnPrompt } from "./evaluate";
import { asyncLines, countLines, formLines, listLines, tableLines } from "./examples";
import { componentDefs } from "./registry/defs";
import type { ChunkComponent } from "./types";
import { buildElementTreeSummary } from "./promptUtils";

export function getPrompt({
  existingLines,
  previousPrompt,
}: {
  existingLines?: ChunkComponent[];
  previousPrompt?: string;
} = {}) {
  const existingContext =
    existingLines && existingLines.length > 0
      ? `
# Existing UI Context

The user previously built a UI with the following prompt:
"${previousPrompt ?? "(unknown)"}"

## Existing UI Tree Structure
${buildElementTreeSummary(existingLines)}

## Existing UI (full JSONL)
${existingLines.map((line) => JSON.stringify(line)).join("\n")}

## Context Handling Instructions
- If the user's new prompt clearly asks to MODIFY, EXTEND, or CHANGE the existing UI (e.g. "add a column", "change the title", "make the button red"), you MUST reproduce the existing UI as closely as possible, applying ONLY the requested changes. Output a complete new JSONL that preserves everything that should stay the same.
- If the user's new prompt asks for something ENTIRELY DIFFERENT (e.g. a new unrelated UI, a different topic), IGNORE the existing UI completely and build from scratch.
- When preserving existing UI, keep the same chunk IDs where possible so the transition feels seamless.
- Do NOT mention the existing UI in your output. Just output JSONL as instructed.
`
      : "";

  return `
${INSTRUCTIONS}

${getPartialFnPrompt()}

${componentDefs.getDefPartialPrompt()}

${existingContext}

# Examples
## Counter
Source prompt: "Create a counter with an increment button"
Output:
${countLines.map((line) => JSON.stringify(line)).join("\n")}
## Form with Input
Source prompt: "Create a form with a number input field"
Output:
${formLines.map((line) => JSON.stringify(line)).join("\n")}
## Dynamic List
Source prompt: "Create a dynamic list where I can add items"
Output:
${listLines.map((line) => JSON.stringify(line)).join("\n")}
## Table with Computed Columns, Add/Remove Rows
Source prompt: "Create a table with columns A and B, a computed Sum column, ability to add and delete rows, and a footer showing the total sum"
Output:
${tableLines.map((line) => JSON.stringify(line)).join("\n")}
## Async Data Fetching (Users Table)
Source prompt: "Show a table of users with their name and email fetched from the server"
Output:
${asyncLines.map((line) => JSON.stringify(line)).join("\n")}
`;
}