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
