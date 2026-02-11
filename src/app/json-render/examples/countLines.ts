import { ChunkComponent } from "../types";

export const countLines: ChunkComponent[] = [
  {
    id: "card1",
    op: "root",
    type: "element",
    component: "Card",
    props: { expr: '({ title: "Counter" })' },
    deps: ["scopes.root.count"],
    defaults: [{ set: "scopes.root.count", literal: 0 }],
    children: ["count-text", "count-btn"],
  },
  {
    id: "count-text",
    op: "child",
    type: "element",
    component: "Text",
    props: {
      expr: '({ children: scopes.root.count, variant: "large" })',
    },
    deps: ["scopes.root.count"],
  },
  {
    id: "count-btn",
    op: "child",
    type: "element",
    component: "Button",
    props: { literal: { children: "Increment" } },
    callbacks: {
      onClick: [{ set: "scopes.root.count", expr: "scopes.root.count + 1" }],
    },
  },
] as const;
