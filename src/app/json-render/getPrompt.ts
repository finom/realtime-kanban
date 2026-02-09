import INSTRUCTIONS from "./INSTRUCTIONS.json" assert { type: "json" };
import { getPartialFnPrompt } from "./evaluate";
import {
  asyncLines,
  countLines,
  formLines,
  listLines,
  tableLines,
} from "./examples";
import { componentsRegistry } from "./registry";

export function getPrompt() {
  return `
${INSTRUCTIONS}

${getPartialFnPrompt()}

${componentsRegistry.getDefPartialPrompt()}

# EXAMPLES:
## COUNTER:
Source prompt: "Create a counter with an increment button"
${countLines.map((line) => JSON.stringify(line)).join("\n")}
## FORM WITH INPUT:
Source prompt: "Create a form with a number input field"
${formLines.map((line) => JSON.stringify(line)).join("\n")}
## DYNAMIC LIST:
Source prompt: "Create a dynamic list where I can add items"
${listLines.map((line) => JSON.stringify(line)).join("\n")}
## TABLE WITH COMPUTED COLUMNS, ADD/REMOVE ROWS:
Source prompt: "Create a table with columns A and B, a computed Sum column, ability to add and delete rows, and a footer showing the total sum"
${tableLines.map((line) => JSON.stringify(line)).join("\n")}
## ASYNC DATA FETCHING (USERS TABLE):
Source prompt: "Show a table of users with their name and email fetched from the server"
${asyncLines.map((line) => JSON.stringify(line)).join("\n")}
`;
}
