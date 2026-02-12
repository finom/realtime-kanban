import type { ChunkComponent } from "./types";

/**
 * Build a human-readable tree summary of the existing UI chunks.
 * Used in prompts to give the AI context about what was built.
 */
export function buildElementTreeSummary(lines: ChunkComponent[]): string {
  if (!lines.length) return "(empty)";

  const byId: Record<string, ChunkComponent> = {};
  for (const line of lines) {
    byId[line.id] = line;
  }

  const roots = lines.filter((l) => l.op === "root");
  const result: string[] = [];

  for (const root of roots) {
    buildSubtree(root, byId, 0, result);
  }

  return result.join("\n");
}

function buildSubtree(
  chunk: ChunkComponent,
  byId: Record<string, ChunkComponent>,
  depth: number,
  result: string[],
) {
  const indent = "  ".repeat(depth);
  const propsHint = chunk.props
    ? chunk.props.literal
      ? ` props=${JSON.stringify(chunk.props.literal)}`
      : ` props=[dynamic]`
    : "";
  const stateHint =
    chunk.defaults && chunk.defaults.length > 0
      ? ` state=[${chunk.defaults.map((d) => d.set).join(", ")}]`
      : "";
  const typeHint = chunk.type === "list" ? " (list)" : "";
  const callbackHint = chunk.callbacks
    ? ` callbacks=[${Object.keys(chunk.callbacks).join(", ")}]`
    : "";

  result.push(
    `${indent}- [${chunk.id}] ${chunk.component}${typeHint}${propsHint}${stateHint}${callbackHint}`,
  );

  if (chunk.children) {
    for (const childId of chunk.children) {
      const child = byId[childId];
      if (child) {
        buildSubtree(child, byId, depth + 1, result);
      } else {
        result.push(`${indent}  - [${childId}] (not found)`);
      }
    }
  }
}

/**
 * Extract a subtree rooted at a given element ID, including all descendants.
 */
export function extractSubtree(
  elementId: string,
  lines: ChunkComponent[],
): ChunkComponent[] {
  const byId: Record<string, ChunkComponent> = {};
  for (const line of lines) {
    byId[line.id] = line;
  }

  const result: ChunkComponent[] = [];
  const stack = [elementId];

  while (stack.length > 0) {
    const id = stack.pop()!;
    const chunk = byId[id];
    if (!chunk) continue;
    result.push(chunk);
    if (chunk.children) {
      // Push in reverse to maintain order
      for (let i = chunk.children.length - 1; i >= 0; i--) {
        stack.push(chunk.children[i]);
      }
    }
  }

  return result;
}

/**
 * Find the parent chunk of a given element ID.
 */
export function findParent(
  elementId: string,
  lines: ChunkComponent[],
): ChunkComponent | null {
  for (const line of lines) {
    if (line.children?.includes(elementId)) {
      return line;
    }
  }
  return null;
}
