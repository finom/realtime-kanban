import type { ChunkComponent } from "./types";

export const parseScope = (key: string) => {
  // Strip "scopes." prefix if present
  const scopesPrefix = "scopes.";
  const normalizedKey = key.startsWith(scopesPrefix)
    ? key.slice(scopesPrefix.length)
    : key;

  const dotIndex = normalizedKey.indexOf(".");
  if (dotIndex === -1) {
    throw new Error("Invalid scope key: " + key);
  } else {
    return [
      normalizedKey.slice(0, dotIndex),
      normalizedKey.slice(dotIndex + 1),
    ] as [string, string];
  }
};

/**
 * Build an elements-by-id map from the NDJSON lines array.
 *
 * When a chunk with a duplicate id is encountered (i.e. the LLM re-emits
 * a chunk to add children), new children are **appended** to the existing
 * element's children list while all other properties use last-write-wins.
 * This preserves previously streamed subtrees when the LLM re-emits a
 * parent to attach additional children.
 */
export function buildElementsById(
  lines: ChunkComponent[],
): Record<string, ChunkComponent> {
  const map: Record<string, ChunkComponent> = {};

  for (const line of lines) {
    const existing = map[line.id];
    if (existing?.children && line.children) {
      const seen = new Set(existing.children);
      const merged = [...existing.children];
      for (const child of line.children) {
        if (!seen.has(child)) {
          merged.push(child);
        }
      }
      map[line.id] = { ...line, children: merged };
    } else {
      map[line.id] = line;
    }
  }

  return map;
}
