import React, { ReactNode, useEffect, useReducer } from "react";
import { evaluate } from '@marcbachmann/cel-js'
import z from "zod";
import { createReactiveProxy } from "./createReactiveProxy";

export type ChunkComponent = {
    id: string;
    component: string;
    type: 'element' | 'list';
    itemScope?: string;
    itemsExpr?: string;
    props?: string;
    deps?: string[];
    defaults?: SetExpr[];
    callbacks?: Record<string, SetExpr[]>;
    children?: string[];
};

type Chunk = ChunkComponent;

type SetExpr = { set?: string; expr?: string; literal?: unknown };

type CallbacksToFunctions<T extends Record<string, z.ZodTypeAny>> = {
  [K in keyof T]: (args: z.infer<T[K]>) => void;
};

const createAIComponent = <
  TProps extends z.ZodObject<any, any>,
  TCallbacks extends Record<string, z.ZodTypeAny>
>(config: {
  propDefs: TProps;
  callbacks?: TCallbacks;
  description?: string;
  render: (
    props: { children?: ReactNode } & z.infer<TProps> & CallbacksToFunctions<TCallbacks>
  ) => React.ReactElement;
  scopes?: object[];
}) => {
  return (myprops: { chunk: Chunk, children: ReactNode, scopes: Record<string, any> }) => {
    const { chunk, children } = myprops;
    const props: z.infer<TProps> = chunk.props ? evaluate(chunk.props, {
      ...myprops.scopes
    }) as z.infer<TProps> : {} as z.infer<TProps>;
    const chunkCallbacks = chunk.callbacks ? chunk.callbacks : {};
    const callbacks = Object.fromEntries(
      Object.keys(chunkCallbacks).map((key) => [key, (evt: any) => {
        let result: unknown;

        for (const { expr, set } of chunkCallbacks[key]) {
          result = expr ? evaluate(expr, { evt, ...myprops.scopes }) : evt.value;
          if (set) {
            const [targetScope, targetPath] = parseScope(set);
            myprops.scopes[targetScope].$set(targetPath, result);
          }
        }

        return result;
      }])
    ) as CallbacksToFunctions<TCallbacks>;

    return config.render({ children, ...props, ...callbacks });
  };
};


const parseScope = (key: string) => {
  const dotIndex = key.indexOf('.');
  if(dotIndex === -1) {
    throw new Error('Invalid scope key: ' + key);
  } else {
    return [key.slice(0, dotIndex), key.slice(dotIndex + 1)] as [string, string];
  }
};


const RecursiveRenderer = ({ elementKey, elements, scopes }: { elementKey: string; elements: Record<string, ChunkComponent>, scopes: Record<string, ReturnType<typeof createReactiveProxy>> }): React.ReactElement => {
  const element = elements[elementKey];
  const [, forceRender] = useReducer((x: number): number => x + 1, 0);
  const hasBeenRenderedRef = React.useRef(false);
  if (!element) return <div className="text-gray-400 italic">Loading component...</div>

  const Component = registry.components[element.component]
  if (!Component) return <div className="text-red-500">Unknown component: {element.component}</div>

  const children = element.children
    ? element.children.map((childKey: string) => (
        <RecursiveRenderer key={childKey} elementKey={childKey} elements={elements} scopes={scopes} />
      ))
    : null;

  if(element.defaults && !hasBeenRenderedRef.current) {
    element.defaults.forEach(def => {
      if(def.set) {
        console.log('Applying default', def);
        const value = def.expr ? evaluate(def.expr, scopes) : def.literal;
        // scopes.scope[def.set] = value;
        const [targetScope, targetPath] = parseScope(def.set);
        scopes[targetScope].$setDefault(targetPath, value);
        console.log(' scopes[targetScope]', scopes[targetScope]);
      }
    });
    hasBeenRenderedRef.current = true;
  }

  useEffect(() => {
    if(element.deps) {
      const unsubscribers: (() => void)[] = [];
      for(const dep of element.deps) {
        const [targetScope, targetPath] = parseScope(dep);

        const unsubscribe = scopes[targetScope].$emitter.on(targetPath, (newValue: unknown) => {
          console.log(`Dependency changed: ${dep} =`, newValue);
          forceRender();
        });
        unsubscribers.push(unsubscribe);
      }
      return () => {
        unsubscribers.forEach(unsub => unsub());
      }
    }

    return () => {};
  }, [element, scopes]);

  return <Component chunk={element} scopes={scopes}>{children}</Component>
}


const createAIComponentRegistry = (components: Record<string, ReturnType<typeof createAIComponent>>) => {
  const scope = createReactiveProxy();
  return {
    components,
    Renderer: ({ lines }: { lines: Chunk[] }) => {
      const componentsById = lines.reduce((acc, line) => {
        acc[line.component] = line;
        return acc;
      }, {} as Record<string, any>);
      return lines.map((line, index) => {
          const Component = components[line.component];
          if (!Component) {
            return <div key={index}>Unknown component: {line.component} </div>;
          }
          if(line.type === 'element') return <RecursiveRenderer key={index} elementKey={line.component} elements={componentsById} scopes={{ scope }} />;
          if(line.type === 'list') {
            const scopeKey = line.itemScope;
            return <RecursiveRenderer key={index} elementKey={line.component} elements={componentsById} scopes={{ scope }} />;
          }
          return <>Error</>
      });
    }
  }
};

export const registry = createAIComponentRegistry({
  Card: createAIComponent({
    propDefs: z.object({
      title: z.string().optional(),
      padding: z.enum(['md', 'sm']).default('md'),
      children: z.any().optional(),
    }),
    callbacks: {
      onClick: z.object({ x: z.any().optional() }),
    },
    render: ({ title, padding, children, onClick }) => {
      return <div title={title} onClick={() => onClick({ x: 0 })} className={`rounded-xl shadow-lg border border-gray-200 ${padding === 'md' ? 'p-6' : 'p-4'}`}>{children}</div>;  
    }
  }),
  Input: createAIComponent({
    propDefs: z.object({
      label: z.string().optional(),
      value: z.any(),
      type: z.enum(['text', 'number']).default('text'),
    }),
    callbacks: {
      onChange: z.object({ 
        value: z.string().meta({ description: "The current value of the input" }), 
        valueAsNumber: z.number().meta({ description: "The current value of the input as a number, if NaN then 0" }) 
      }),
    },
    render: ({ label, value, type = 'text', onChange }) => {
      return <div className="flex flex-col gap-1">
        {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
        <input
          type={type}
          value={value as string | number | readonly string[] | undefined}
          onChange={(e) => {
            onChange?.({ value: e.target.value, valueAsNumber: e.target.valueAsNumber || 0 });
          }}
          className="border border-gray-300 rounded px-3 py-2"
        />
      </div>;
    }
  }),
  Ul: createAIComponent({
    propDefs: z.object({}),
    render: ({ children }) => {
      return <ul>{children}</ul>
    }
  }),
  Li: createAIComponent({
    propDefs: z.object({}),
    render: ({ children }) => {
      return <li>{children}</li>;
    }
  }),
});

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