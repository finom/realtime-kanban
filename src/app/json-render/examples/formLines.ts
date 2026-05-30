import { ChunkComponent } from "../types";

export const formLines: ChunkComponent[] = [
  {
    id: "card2",
    op: "root",
    type: "element",
    component: "Card",
    props: { literal: { title: "Form Example" } },
    defaults: [{ set: "scopes.root.count", literal: 0 }],
    children: ["field1"],
  },
  {
    id: "field1",
    op: "child",
    type: "element",
    component: "Field",
    children: ["field1-label", "input1", "field1-desc"],
  },
  {
    id: "field1-label",
    op: "child",
    type: "element",
    component: "FieldLabel",
    props: { literal: { children: "Count" } },
  },
  {
    id: "input1",
    op: "child",
    type: "element",
    component: "Input",
    props: {
      expr: '({ value: scopes.root.count, type: "number" })',
    },
    deps: ["scopes.root.count"],
    callbacks: {
      onChange: [{ set: "scopes.root.count", expr: "evt.valueAsNumber" }],
    },
  },
  {
    id: "field1-desc",
    op: "child",
    type: "element",
    component: "FieldDescription",
    props: { literal: { children: "Enter a number value" } },
  },
] as const;
