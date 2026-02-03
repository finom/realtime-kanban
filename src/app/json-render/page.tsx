'use client'

import { ChunkComponent, registry } from "./render"


const countLines: ChunkComponent[] = [
 {
    "id": "card1",
      "type": "element",
      "component": "Card",
      "props": "{ \"children\": scope.count }",
      "deps": ["scope.count"],
      "defaults": [
        { "set": "scope.count", "literal": 0 }
      ],
      // "children": [],
      "callbacks": {
        "onClick": [
          { "set": "scope.count", "expr": "scope.count + 1.0" },
          // { "set": "scope.count", "expr": "scope.count + 2.0" }
        ],
      }
    },
] as const;

const formLines: ChunkComponent[] = [
 {
    "id": "card2",
      "type": "element",
      "component": "Card",
      "props": "{ \"children\": scope.count }",
      "deps": ["scope.count"],
      "defaults": [
        { "set": "scope.count", "literal": 0 }
      ],
      "children": ['input1', 'list1'],
      "callbacks": {
        "onClick": [
          { "set": "scope.count", "expr": "scope.count + 1.0" },
          // { "set": "scope.count", "expr": "scope.count + 2.0" }
        ],
      }
    },
    {
        "id": "input1",
        "type": "element",
        "component": "Input",
        "props": "{ \"value\": dyn(scope.count), \"label\": dyn(\"Count\"), \"type\": dyn(\"number\") }",
        "deps": ["scope.count"],
        "callbacks": {
          "onChange": [
            { "set": "scope.count", "expr": "evt.valueAsNumber" }
          ]
        }
      },
      {
        "id": "list1",
        "type": "element",
        "component": "Ul",
      },
      {
        "id": "list1",
        "type": "list",
        "itemScope": "itemScope",
        "component": "Li",
        "itemsExpr": "scope.items",
        "props": "{ \"children\": itemScope.item }",
        "defaults": [
          { "set": "scope.items", "literal": [ "Item 1", "Item 2", "Item 3" ] }
        ]
      }
] as const;


export default function Page() {
  return <>
    <registry.Renderer lines={countLines} />
    <registry.Renderer lines={formLines} />
  </>;
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