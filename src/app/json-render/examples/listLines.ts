import { ChunkComponent } from "../types";

export const listLines: ChunkComponent[] = [
  {
    id: "list-card",
    op: "root",
    type: "element",
    component: "Card",
    props: { literal: { title: "Dynamic List" } },
    children: ["list-items", "add-item-button"],
    defaults: [
      { set: "scopes.root.items", literal: ["Item 1", "Item 2", "Item 3"] },
    ],
  },
  {
    id: "list-items",
    op: "child",
    type: "list",
    itemScope: "itemScope",
    component: "FlexRow",
    itemsSource: "scopes.root.items",
    props: { literal: { gap: "2" } },
    children: ["item-badge"],
  },
  {
    id: "item-badge",
    op: "child",
    type: "element",
    component: "Badge",
    props: { expr: "({ children: scopes.itemScope.item })" },
  },
  {
    id: "add-item-button",
    op: "child",
    type: "element",
    component: "Button",
    props: { literal: { children: "Add Item", variant: "outline" } },
    callbacks: {
      onClick: [
        {
          set: "scopes.root.items",
          expr: '[...scopes.root.items, "Item " + (scopes.root.items.length + 1)]',
        },
      ],
    },
  },
] as const;
