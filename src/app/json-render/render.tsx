"use client";
import React, {
  ReactNode,
  Suspense,
  use,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";

import { createReactiveProxy } from "./createReactiveProxy";
import {
  AssignableExpr,
  ChunkComponent,
  ChunkComponentList,
  ValueExpr,
} from "./types";
import { componentsRegistry } from "./registry";
import { evaluate } from "./evaluate";
import { parseScope } from "./utils";

export const RecursiveRenderer = ({
  elementKey,
  elements,
  scopes,
}: {
  elementKey: string;
  elements: Record<string, ChunkComponent>;
  scopes: Record<string, ReturnType<typeof createReactiveProxy>>;
}): React.ReactElement => {
  const element = elements[elementKey];
  const [, forceRender] = useReducer((x: number): number => x + 1, 0);
  const hasBeenRenderedRef = React.useRef(false);
  if (!element)
    return <div className="text-gray-400 italic">Generating component...</div>;

  const Component = componentsRegistry.components[element.component].component;
  if (!Component)
    return (
      <div className="text-red-500">Unknown component: {element.component}</div>
    );

  const children = element.children
    ? element.children.map((childKey: string) => {
        const childElement = elements[childKey];
        if (childElement?.type === "list") {
          return (
            <ListRenderer
              key={childKey}
              elementKey={childKey}
              elements={elements}
              scopes={scopes}
              line={childElement}
            />
          );
        }
        return (
          <RecursiveRenderer
            key={childKey}
            elementKey={childKey}
            elements={elements}
            scopes={scopes}
          />
        );
      })
    : null;

  const setDefaultsPromiseRef = useRef<Promise<void> | null>(null);

  if (element.defaults && !hasBeenRenderedRef.current) {
    const collected: {
      targetScope: string;
      targetPath: string;
      value: unknown;
    }[] = [];
    let hasAsync = false;
    element.defaults.forEach((setExpr) => {
      if (setExpr.set) {
        const value = evaluate<AssignableExpr>(setExpr, { scopes });
        const [targetScope, targetPath] = parseScope(setExpr.set);
        if (value instanceof Promise) {
          hasAsync = true;
        }
        collected.push({ targetScope, targetPath, value });
      }
    });
    if (hasAsync) {
      setDefaultsPromiseRef.current = Promise.all(
        collected.map(async ({ targetScope, targetPath, value }) => {
          scopes[targetScope].$set(targetPath, await value);
        }),
      ).then(() => {
        setTimeout(() => {
          setDefaultsPromiseRef.current = null;
        }, 0);
      });
    } else {
      for (const { targetScope, targetPath, value } of collected) {
        scopes[targetScope].$set(targetPath, value);
      }
    }
    hasBeenRenderedRef.current = true;
  }

  useEffect(() => {
    if (element.deps) {
      const unsubscribers: (() => void)[] = [];
      for (const dep of element.deps) {
        const [targetScope, targetPath] = parseScope(dep);

        const unsubscribe = scopes[targetScope].$emitter.on(
          targetPath,
          (newValue: unknown) => {
            console.log(`Dependency changed: ${dep} =`, newValue);
            forceRender();
          },
        );
        unsubscribers.push(unsubscribe);
      }
      return () => {
        unsubscribers.forEach((unsub) => unsub());
      };
    }

    return () => {};
  }, [element, scopes]);

  if (setDefaultsPromiseRef.current) {
    const p = setDefaultsPromiseRef.current;
    const Comp = () => {
      use(p!);
      return (
        <Component chunk={element} scopes={scopes}>
          {children}
        </Component>
      );
    };
    return (
      <Suspense
        fallback={
          <div className="text-gray-400 italic">Setting defaults...</div>
        }
      >
        <Comp />
      </Suspense>
    );
  }

  return (
    <Component chunk={element} scopes={scopes}>
      {children}
    </Component>
  );
};

const getItemId = (
  idKey: string | undefined,
  item: unknown,
  index: number,
): string | number => {
  const key = idKey ?? "_index";
  if (key === "_index") return index;
  if (key === "_item") return item as string | number;
  return ((item as Record<string, unknown>)?.[key] ?? index) as string | number;
};

export const ListRenderer = ({
  elementKey,
  elements,
  scopes,
  line,
}: {
  elementKey: string;
  elements: Record<string, ChunkComponent>;
  scopes: Record<string, ReturnType<typeof createReactiveProxy>>;
  line: ChunkComponentList;
}): React.ReactElement => {
  const element = elements[elementKey];
  const [, forceRender] = useReducer((x) => x + 1, 0);
  // Cache item proxies by unique ID to preserve state across re-renders
  const itemProxiesRef = React.useRef<
    Map<string | number, ReturnType<typeof createReactiveProxy>>
  >(new Map());

  if (!element)
    return <div className="text-gray-400 italic">Loading list...</div>;

  if (element.type !== "list")
    return (
      <div className="text-red-500">Element is not a list: {elementKey}</div>
    );

  // Subscribe to changes in the items expression
  // items is a CEL expression like "scopes.root.rows", we need to extract "root.rows" for subscription
  useEffect(() => {
    if (line.items.expr) {
      // Parse "scopes.root.path" -> ["root", "path"]
      const [targetScope, targetPath] = parseScope(line.items.expr);
      const unsubscribe = scopes[targetScope].$emitter.on(targetPath, () => {
        console.log(`List items changed: ${line.items.expr}`);
        forceRender();
      });
      return unsubscribe;
    }
    return () => {};
  }, [line.items, scopes]);

  const items = evaluate<ValueExpr>(line.items || "[]", {
    scopes,
  }) as unknown[];

  // Clean up proxies for removed items (by ID)
  const currentIds = new Set(
    items.map((item, index) => getItemId(line.idKey, item, index)),
  );
  itemProxiesRef.current.forEach((_, id) => {
    if (!currentIds.has(id)) {
      itemProxiesRef.current.delete(id);
    }
  });

  const lastScope = scopes[Object.keys(scopes)[Object.keys(scopes).length - 1]];

  const childrenAndScopes = items.map((item, index) => {
    // Use item's id if available, otherwise fall back to index
    const itemId = getItemId(line.idKey, item, index);

    // Reuse existing proxy or create a new one (keyed by ID)
    const existingProxy = itemProxiesRef.current.get(itemId);

    const itemProxy =
      existingProxy ??
      (() => {
        // Create new proxy for new items
        const itemData = { item, index, id: itemId };
        const newProxy = createReactiveProxy(itemData);
        itemProxiesRef.current.set(itemId, newProxy);
        return newProxy;
      })();

    // Always update the index in case items shifted
    (itemProxy as any).index = index;

    const itemScopes = {
      ...scopes,
      [line.itemScope]: itemProxy,
    };

    return [
      <RecursiveRenderer
        key={`${elementKey}-item-${itemId}`}
        elementKey={elementKey}
        elements={elements}
        scopes={itemScopes}
      />,
      itemProxy,
    ];
  });

  const children = childrenAndScopes.map(([child]) => child);
  const itemScopesList = childrenAndScopes.map(([, scope]) => scope);

  lastScope.$set(`childScopes.${line.itemScope}`, itemScopesList);

  return <>{children}</>;
};
