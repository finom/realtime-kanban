import INSTRUCTIONS from "./INSTRUCTIONS.json" assert { type: "json" };
import { getPartialFnPrompt } from "./evaluate";
import { asyncLines, countLines, formLines, listLines, tableLines } from "./examples";
import { componentDefs } from "./registry/defs";

export function getPrompt() {
  return `
${INSTRUCTIONS}

${getPartialFnPrompt()}

${componentDefs.getDefPartialPrompt()}

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