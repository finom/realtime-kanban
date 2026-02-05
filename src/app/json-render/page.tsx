"use client";

import { ChunkComponent } from "./types";
import { registry } from "./registry";

const countLines: ChunkComponent[] = [
  {
    id: "card1",
    op: "root",
    type: "element",
    component: "Card",
    props: '{ "children": scopes.root.count }',
    deps: ["scopes.root.count"],
    defaults: [{ set: "scopes.root.count", literal: 0 }],
    // "children": [],
    callbacks: {
      onClick: [
        { set: "scopes.root.count", expr: "scopes.root.count + 1.0" },
        // { "set": "scopes.root.count", "expr": "scopes.root.count + 2.0" }
      ],
    },
  },
] as const;

const formLines: ChunkComponent[] = [
  {
    id: "card2",
    op: "root",
    type: "element",
    component: "Card",
    props: '{ "children": scopes.root.count }',
    deps: ["scopes.root.count"],
    defaults: [{ set: "scopes.root.count", literal: 0 }],
    children: ["input1"],
    callbacks: {
      onClick: [
        { set: "scopes.root.count", expr: "scopes.root.count + 1.0" },
        // { "set": "scopes.root.count", "expr": "scopes.root.count + 2.0" }
      ],
    },
  },
  {
    id: "input1",
    op: "child",
    type: "element",
    component: "Input",
    props:
      '{ "value": dyn(scopes.root.count), "label": dyn("Count"), "type": dyn("number") }',
    deps: ["scopes.root.count"],
    callbacks: {
      onChange: [{ set: "scopes.root.count", expr: "evt.valueAsNumber" }],
    },
  },
] as const;

const listLines: ChunkComponent[] = [
  {
    id: "list1",
    op: "root",
    type: "element",
    component: "Ul",
    children: ["list1-item", "add-item-button"],
    defaults: [
      { set: "scopes.root.items", literal: ["Item 1", "Item 2", "Item 3"] },
    ],
  },
  {
    id: "list1-item",
    op: "child",
    type: "list",
    itemScope: "itemScope",
    component: "Li",
    items: "scopes.root.items",
    props: '{ "children": scopes.itemScope.item }',
  },
  {
    id: "add-item-button",
    op: "child",
    type: "element",
    component: "Button",
    props: '{ "children": "Add Item" }',
    callbacks: {
      onClick: [
        {
          set: "scopes.root.items",
          expr: 'scopes.root.items + ["Item " + string(size(scopes.root.items) + 1)]',
        },
      ],
    },
  },
] as const;

// Demo chunks for the table with A, B, Sum columns
export const tableChunks: ChunkComponent[] = [
  {
    id: "table-card",
    component: "Table",
    op: "root",
    type: "element",
    defaults: [
      { set: "scopes.root.rows", literal: [{ id: 1.0, a: 0.0, b: 0.0 }] },
      { set: "scopes.root.nextId", literal: 2.0 },
      { set: "scopes.root.totalSum", literal: 0.0 },
    ],
    children: ["thead", "tbody", "tfoot"],
  },
  {
    id: "thead",
    component: "Thead",
    op: "child",
    type: "element",
    children: ["header-row"],
  },
  {
    id: "header-row",
    component: "Tr",
    op: "child",
    type: "element",
    children: ["th-a", "th-b", "th-sum", "th-actions"],
  },
  {
    id: "th-a",
    component: "Th",
    op: "child",
    type: "element",
    props: '{"text": "A"}',
  },
  {
    id: "th-b",
    component: "Th",
    op: "child",
    type: "element",
    props: '{"text": "B"}',
  },
  {
    id: "th-sum",
    component: "Th",
    op: "child",
    type: "element",
    props: '{"text": "Sum"}',
  },
  {
    id: "th-actions",
    component: "Th",
    op: "child",
    type: "element",
    props: '{"text": "Actions"}',
  },
  {
    id: "tbody",
    component: "Tbody",
    op: "child",
    type: "element",
    children: ["data-rows"],
  },
  {
    id: "data-rows",
    component: "Tr",
    op: "child",
    type: "list",
    idKey: 'id',
    items: "scopes.root.rows",
    itemScope: "row",
    children: ["td-input-a", "td-input-b", "td-sum", "td-delete"],
  },
  {
    id: "td-input-a",
    component: "Td",
    op: "child",
    type: "element",
    children: ["input-a"],
  },
  {
    id: "input-a",
    component: "NumberInput",
    op: "child",
    type: "element",
    props: '{"value": scopes.row.item.a}',
    deps: ["scopes.row.item.a"],
    callbacks: {
      onChange: [
        { set: "scopes.row.item.a", expr: "evt.value" },
        {
          set: "scopes.root.totalSum",
          expr: "reduce(scopes.root.childScopes.row.map(r, double(r.item.a) + double(r.item.b)), 0.0)",
        },
      ],
    },
  },
  {
    id: "td-input-b",
    component: "Td",
    op: "child",
    type: "element",
    children: ["input-b"],
  },
  {
    id: "input-b",
    component: "NumberInput",
    op: "child",
    type: "element",
    props: '{"value": scopes.row.item.b}',
    deps: ["scopes.row.item.b"],
    callbacks: {
      onChange: [
        { set: "scopes.row.item.b", expr: "evt.value" },
        {
          set: "scopes.root.totalSum",
          expr: "reduce(scopes.root.childScopes.row.map(r, double(r.item.a) + double(r.item.b)), 0.0)",
        },
      ],
    },
  },
  {
    id: "td-sum",
    component: "Td",
    op: "child",
    type: "element",
    children: ["sum-text"],
  },
  {
    id: "sum-text",
    component: "Text",
    op: "child",
    type: "element",
    props: '{"value": double(scopes.row.item.a) + double(scopes.row.item.b)}',
    deps: ["scopes.row.item.a", "scopes.row.item.b"],
  },
  {
    id: "td-empty",
    component: "Td",
    op: "child",
    type: "element",
  },
  {
    id: "td-delete",
    component: "Td",
    op: "child",
    type: "element",
    children: ["delete-btn"],
  },
  {
    id: "delete-btn",
    component: "Button",
    op: "child",
    type: "element",
    props: '{"text": "Delete"}',
    callbacks: {
      onClick: [
        {
          set: "scopes.root.rows",
          expr: "scopes.root.rows.filter(r, r.id != scopes.row.item.id)",
        },
        {
          set: "scopes.root.totalSum",
          expr: "reduce(scopes.root.childScopes.row.map(r, double(r.item.a) + double(r.item.b)), 0.0)",
        },
      ],
    },
  },
  {
    id: "tfoot",
    component: "Tfoot",
    op: "child",
    type: "element",
    children: ["footer-row"],
  },
  {
    id: "footer-row",
    component: "Tr",
    op: "child",
    type: "element",
    children: ["td-total-label", "td-add-btn", "td-total-sum", "td-row-count"],
  },
  {
    id: "td-total-label",
    component: "Td",
    op: "child",
    type: "element",
    props: '{"text": "Total"}',
  },
  {
    id: "td-add-btn",
    component: "Td",
    op: "child",
    type: "element",
    children: ["add-btn"],
  },
  {
    id: "add-btn",
    component: "Button",
    op: "child",
    type: "element",
    props: '{"text": "+ Add Row"}',
    callbacks: {
      onClick: [
        {
          set: "scopes.root.rows",
          expr: "scopes.root.rows + [{'id': dyn(scopes.root.nextId), 'a': dyn(0.0), 'b': dyn(0.0)}]",
        },
        { set: "scopes.root.nextId", expr: "scopes.root.nextId + 1.0" },
      ],
    },
  },
  {
    id: "td-total-sum",
    component: "Td",
    op: "child",
    type: "element",
    children: ["total-sum-text"],
  },
  {
    id: "total-sum-text",
    component: "Text",
    op: "child",
    type: "element",
    props:
      '{"value": scopes.root.totalSum}',
    deps: ["scopes.root.totalSum"],
  },
  {
    id: "td-row-count",
    component: "Td",
    op: "child",
    type: "element",
    children: ["row-count-text"],
  },
  {
    id: "row-count-text",
    component: "Text",
    op: "child",
    type: "element",
    props: '{"value": string(size(scopes.root.rows)) + " rows"}',
    deps: ["scopes.root.rows"],
  },
] as const;

export default function Page() {
  return (
    <>
      <registry.Renderer lines={countLines} />
      <registry.Renderer lines={formLines} />
      <registry.Renderer lines={listLines} />
      <registry.Renderer lines={tableChunks} />
    </>
  );
}
/* 
import React, { useState, useEffect } from 'react'

const Card = ({ title, padding = 'md', children }: any) => (
  <div className="bg-white rounded-xl shadow-lg border p-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
)

const Grid = ({ columns = 2, gap = 'md', children }: any) => (
  <div className="grid grid-cols-2 gap-6">
    {children}
  </div>
)

const Metric = ({ label, valuePath, format, trend, trendValue }: any) => {
  const [value, setValue] = useState('Loading...')

  useEffect(() => {
    const timer = setTimeout(() => {
      if (format === 'currency') setValue('$1,245,890')
      else if (format === 'percent') setValue('14.8%')
    }, 600)
    return () => clearTimeout(timer)
  }, [format])

  return (
    <div className="bg-gray-50 rounded-lg p-5 border">
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className="text-3xl font-bold text-gray-900 mt-1">{value}</div>
      {trendValue && (
        <div className="text-green-600 text-sm font-medium mt-1">{trendValue} from last month</div>
      )}
    </div>
  )
}

const Chart = ({ type, dataPath, title }: any) => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 900)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-500">
        {loaded ? `📊 ${type.toUpperCase()} Chart - Sales by Region` : 'Loading chart data...'}
      </div>
    </div>
  )
}

const componentRegistry: Record<string, any> = {
  Card,
  Grid,
  Metric,
  Chart,
}

const RecursiveRenderer = ({ elementKey, elements }: { elementKey: string; elements: Record<string, any> }) => {
  const element = elements[elementKey]
  if (!element) return <div className="text-gray-400 italic">Loading component...</div>

  const Component = componentRegistry[element.type]
  if (!Component) return <div className="text-red-500">Unknown component: {element.type}</div>

  const children = element.children
    ? element.children.map((childKey: string) => (
        <RecursiveRenderer key={childKey} elementKey={childKey} elements={elements} />
      ))
    : null

  return <Component {...element.props}>{children}</Component>
}

export default function ProgressiveDashboardPage() {
  const [elements, setElements] = useState<Record<string, any>>({})
  const loadedCount = Object.keys(elements).length

  const applyPatch = (patch: any) => {
    if (patch.op !== 'add') return
    const parts = patch.path.split('/').filter(Boolean)
    if (parts[0] !== 'elements' || parts.length !== 2) return
    const key = parts[1]
    setElements(prev => ({ ...prev, [key]: patch.value }))
  }

  useEffect(() => {
    const stream = [
      {"op":"add","path":"/elements/main-card","value":{"key":"main-card","type":"Card","props":{"title":"Revenue Dashboard","padding":"md"},"children":["metrics-grid","chart"]}},
      {"op":"add","path":"/elements/metrics-grid","value":{"key":"metrics-grid","type":"Grid","props":{"columns":2,"gap":"md"},"children":["revenue-metric","growth-metric"]}},
      {"op":"add","path":"/elements/revenue-metric","value":{"key":"revenue-metric","type":"Metric","props":{"label":"Total Revenue","valuePath":"/analytics/revenue","format":"currency","trend":"up","trendValue":"+15%"}}},
      {"op":"add","path":"/elements/growth-metric","value":{"key":"growth-metric","type":"Metric","props":{"label":"Growth Rate","valuePath":"/analytics/growth","format":"percent"}}},
      {"op":"add","path":"/elements/chart","value":{"key":"chart","type":"Chart","props":{"type":"bar","dataPath":"/analytics/salesByRegion","title":"Sales by Region"}}}
    ]

    let index = 0
    const interval = setInterval(() => {
      if (index < stream.length) {
        applyPatch(stream[index])
        index++
      } else {
        clearInterval(interval)
      }
    }, 1400) // 1.4s delay per component for clear progressive effect

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Progressive Component Loading</h1>
          <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full border">
            Loaded: {loadedCount}/5 components
          </div>
        </div>

        <RecursiveRenderer elementKey="main-card" elements={elements} />
      </div>
    </div>
  )
}
  */
