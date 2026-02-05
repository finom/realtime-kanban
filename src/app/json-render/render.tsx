import React, { ReactNode, useEffect, useMemo, useReducer } from "react";

import { createReactiveProxy } from "./createReactiveProxy";
import { ChunkComponent, ChunkComponentList } from "./types";
import { registry } from "./registry";
import { evaluate } from "./evaluate";
import { parseScope } from "./utils";

// Create a custom CEL environment with scopes and evt variables

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
    return <div className="text-gray-400 italic">Loading component...</div>;

  const Component = registry.components[element.component];
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

  if (element.defaults && !hasBeenRenderedRef.current) {
    element.defaults.forEach((def) => {
      if (def.set) {
        console.log("Applying default", def);
        const value = def.expr ? evaluate(def.expr, { scopes }) : def.literal;
        const [targetScope, targetPath] = parseScope(def.set);
        scopes[targetScope].$setDefault(targetPath, value);
        console.log(" scopes[targetScope]", scopes[targetScope]);
      }
    });
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

  return (
    <Component chunk={element} scopes={scopes}>
      {children}
    </Component>
  );
};

const getItemId = (
  idKey: string | undefined,
  item: unknown,
  index: number
): string | number => {
  const key = idKey ?? '_index';
  if (key === '_index') return index;
  if (key === '_item') return item as string | number;
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
    if (line.items) {
      // Parse "scopes.root.path" -> ["root", "path"]
      const [targetScope, targetPath] = parseScope(line.items);
      const unsubscribe = scopes[targetScope].$emitter.on(targetPath, () => {
        console.log(`List items changed: ${line.items}`);
        forceRender();
      });
      return unsubscribe;
    }
    return () => {};
  }, [line.items, scopes]);

  const items = evaluate(line.items || "[]", { scopes }) as unknown[];

  // Clean up proxies for removed items (by ID)
  const currentIds = new Set(items.map((item, index) => getItemId(line.idKey, item, index)));
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

    console.log('itemId', itemId, 'itemProxy', itemProxy);

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

  console.log('itemScopesList', itemScopesList);

  lastScope.$set(`childScopes.${line.itemScope}`, itemScopesList);

  return <>{children}</>;
};

/* 
registry.build(lines);

const Card = createAIComponent({
  propDefs: z.object({
    title: z.string().optional(),
    padding: z.enum(['md', 'sm']).default('md'),
    children: z.any().optional(),
  }),
  callbacks: {
    onClick: z.object({}),
  },
  render: ({ children }) => {
    return <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">{children}</div>;
  }
});

// Component Registry
const CardOriginal = ({ title, padding, children }: CardProps) => (
  <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${padding === 'md' ? 'p-6' : 'p-4'} animate-fade-in`}>
    {title && <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>}
    {children}
  </div>
);

const Grid = ({ columns, gap, children }: GridProps) => (
  <div className={`grid gap-${gap === 'md' ? '4' : '2'} animate-fade-in`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
    {children}
  </div>
);

const Metric = ({ label, valuePath, format, trend, trendValue }: MetricProps) => {
  const rawValue = dataStore[valuePath];
  const formatted = format === 'currency' 
    ? `$${rawValue?.toLocaleString()}` 
    : format === 'percent' 
    ? `${(rawValue * 100).toFixed(1)}%` 
    : rawValue;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 animate-fade-in">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{formatted}</p>
      {trend && (
        <p className={`text-sm mt-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? '↑' : '↓'} {trendValue}
        </p>
      )}
    </div>
  );
};

const Chart = ({ type, dataPath, title }: ChartProps) => {
  const data = dataStore[dataPath] || [];
  const maxSales = Math.max(...data.map((d: any) => d.sales));

  return (
    <div className="mt-4 animate-fade-in">
      {title && <h3 className="text-sm font-medium text-gray-600 mb-3">{title}</h3>}
      <div className="flex items-end gap-3 h-40">
        {data.map((item: any, i: number) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all duration-500"
              style={{ height: `${(item.sales / maxSales) * 100}%` }}
            />
            <span className="text-xs text-gray-500 mt-2">{item.region}</span>
            <span className="text-xs font-medium">${(item.sales/1000).toFixed(0)}k</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Placeholder = ({ elementKey }: PlaceholderProps) => (
  <div className="bg-gray-100 rounded-lg p-4 animate-pulse border-2 border-dashed border-gray-300">
    <span className="text-gray-400 text-sm">Loading: {elementKey}...</span>
  </div>
);

const componentRegistry = { Card, Grid, Metric, Chart };

// Recursive renderer
type RenderElementProps = {
  elementKey: string;
  elements: Record<string, { type: string; props: Record<string, any>; children?: string[] }>;
};

const RenderElement = ({ elementKey, elements }: RenderElementProps) => {
  const element = elements[elementKey];
  
  if (!element) {
    return <Placeholder elementKey={elementKey} />;
  }

  const Component = componentRegistry[element.type];
  if (!Component) return <div>Unknown: {element.type}</div>;

  const children = element.children?.map(childKey => (
    <RenderElement key={childKey} elementKey={childKey} elements={elements} />
  ));

  return <Component {...element.props}>{children}</Component>;
};

type CardProps = {
  title?: string;
  padding?: 'md' | 'sm';
  children?: ReactNode;
};

type GridProps = {
  columns: number;
  gap?: 'md' | 'sm';
  children?: ReactNode;
};

type MetricProps = {
  label: string;
  valuePath: string;
  format?: 'currency' | 'percent';
  trend?: 'up' | 'down';
  trendValue?: string | number;
};

type ChartProps = {
  type: string;
  dataPath: string;
  title?: string;
};

type PlaceholderProps = {
  elementKey: string;
};

*/
