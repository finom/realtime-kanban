import { componentDefs } from "./registry/defs";
import { getPartialFnPrompt } from "./evaluate";
import type { ChunkComponent } from "./types";
import { buildElementTreeSummary } from "./promptUtils";

/**
 * Build a lightweight prompt for the clarification step.
 * This includes only what the AI needs to understand feasibility and ask smart questions:
 * - Available component names (not full defs)
 * - Available RPC functions
 * - Existing UI context (if any)
 * Does NOT include full INSTRUCTIONS, examples, or detailed component schemas.
 */
export function getClarifyPrompt({
  existingLines,
  previousPrompt,
}: {
  existingLines?: ChunkComponent[];
  previousPrompt?: string;
} = {}) {
  const componentNames = Object.keys(componentDefs.defs);

  const existingContext =
    existingLines && existingLines.length > 0
      ? `
# Existing UI Context
The user previously built a UI with the following prompt:
"${previousPrompt ?? "(unknown)"}"

Current UI structure:
${buildElementTreeSummary(existingLines)}
`
      : "";

  return `You are a UI planning assistant. Before building a UI, you help clarify the user's request.

# Available UI Components
${componentNames.join(", ")}

# Available Backend Functions
${getPartialRPCSignatures()}

${existingContext}
# Your Task
Analyze the user's prompt and respond with:
1. A brief summary of what you will build (or modify, if existing UI is present)
2. The key components and data sources you plan to use
3. Any clarifying questions if the request is ambiguous

Keep your response concise (3-8 sentences). Do NOT output any JSON or code. Plain text only.
If the request is clear enough, just confirm what you will build and say "Ready to generate."
If there is existing UI and the user seems to want changes to it, mention what you will change and what you will preserve.
If the user seems to want something entirely new (unrelated to existing UI), mention that you will build from scratch.`;
}

/**
 * Extracts just the RPC function signatures without the full expression syntax docs.
 */
function getPartialRPCSignatures() {
  // Reuse the evaluate module's prompt but extract only the function list portion
  const fullPrompt = getPartialFnPrompt();
  const rpcStart = fullPrompt.indexOf("Custom async functions (RPC)");
  if (rpcStart === -1) return "";
  return fullPrompt.slice(rpcStart);
}
