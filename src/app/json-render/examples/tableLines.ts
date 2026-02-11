import { ChunkComponent } from "../types";

export const tableLines: ChunkComponent[] = [
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
    component: "TableHeader",
    op: "child",
    type: "element",
    children: ["header-row"],
  },
  {
    id: "header-row",
    component: "TableRow",
    op: "child",
    type: "element",
    children: ["th-a", "th-b", "th-sum", "th-actions"],
  },
  {
    id: "th-a",
    component: "TableHead",
    op: "child",
    type: "element",
    props: { literal: { children: "A" } },
  },
  {
    id: "th-b",
    component: "TableHead",
    op: "child",
    type: "element",
    props: { literal: { children: "B" } },
  },
  {
    id: "th-sum",
    component: "TableHead",
    op: "child",
    type: "element",
    props: { literal: { children: "Sum" } },
  },
  {
    id: "th-actions",
    component: "TableHead",
    op: "child",
    type: "element",
    props: { literal: { children: "Actions" } },
  },
  {
    id: "tbody",
    component: "TableBody",
    op: "child",
    type: "element",
    children: ["data-rows"],
  },
  {
    id: "data-rows",
    component: "TableRow",
    op: "child",
    type: "list",
    idKey: "id",
    itemsSource: "scopes.root.rows",
    itemScope: "row",
    children: ["td-input-a", "td-input-b", "td-sum", "td-delete"],
  },
  {
    id: "td-input-a",
    component: "TableCell",
    op: "child",
    type: "element",
    children: ["input-a"],
  },
  {
    id: "input-a",
    component: "NumberInput",
    op: "child",
    type: "element",
    props: { expr: "({value: scopes.row.item.a})" },
    deps: ["scopes.row.item.a"],
    callbacks: {
      onChange: [
        { set: "scopes.row.item.a", expr: "evt.value" },
        {
          set: "scopes.root.totalSum",
          expr: "scopes.root.childScopes.row.reduce((acc, r) => acc + r.item.a + r.item.b, 0)",
        },
      ],
    },
  },
  {
    id: "td-input-b",
    component: "TableCell",
    op: "child",
    type: "element",
    children: ["input-b"],
  },
  {
    id: "input-b",
    component: "NumberInput",
    op: "child",
    type: "element",
    props: { expr: "({value: scopes.row.item.b})" },
    deps: ["scopes.row.item.b"],
    callbacks: {
      onChange: [
        { set: "scopes.row.item.b", expr: "evt.value" },
        {
          set: "scopes.root.totalSum",
          expr: "scopes.root.childScopes.row.reduce((acc, r) => acc + r.item.a + r.item.b, 0)",
        },
      ],
    },
  },
  {
    id: "td-sum",
    component: "TableCell",
    op: "child",
    type: "element",
    children: ["sum-text"],
  },
  {
    id: "sum-text",
    component: "Text",
    op: "child",
    type: "element",
    props: {
      expr: "({children: scopes.row.item.a + scopes.row.item.b})",
    },
    deps: ["scopes.row.item.a", "scopes.row.item.b"],
  },
  {
    id: "td-delete",
    component: "TableCell",
    op: "child",
    type: "element",
    children: ["delete-btn"],
  },
  {
    id: "delete-btn",
    component: "Button",
    op: "child",
    type: "element",
    props: {
      literal: { children: "Delete", variant: "destructive", size: "sm" },
    },
    callbacks: {
      onClick: [
        {
          set: "scopes.root.rows",
          expr: "scopes.root.rows.filter(r => r.id !== scopes.row.item.id)",
          confirm: "Are you sure you want to delete this row?",
        },
        {
          set: "scopes.root.totalSum",
          expr: "scopes.root.childScopes.row.reduce((acc, r) => acc + r.item.a + r.item.b, 0)",
        },
      ],
    },
  },
  {
    id: "tfoot",
    component: "TableFooter",
    op: "child",
    type: "element",
    children: ["footer-row"],
  },
  {
    id: "footer-row",
    component: "TableRow",
    op: "child",
    type: "element",
    children: ["td-total-label", "td-add-btn", "td-total-sum", "td-row-count"],
  },
  {
    id: "td-total-label",
    component: "TableCell",
    op: "child",
    type: "element",
    props: { literal: { children: "Total" } },
  },
  {
    id: "td-add-btn",
    component: "TableCell",
    op: "child",
    type: "element",
    children: ["add-btn"],
  },
  {
    id: "add-btn",
    component: "Button",
    op: "child",
    type: "element",
    props: {
      literal: { children: "+ Add Row", variant: "outline", size: "sm" },
    },
    callbacks: {
      onClick: [
        {
          set: "scopes.root.rows",
          expr: "[...scopes.root.rows, { id: scopes.root.nextId, a: 0, b: 0 }]",
        },
        { set: "scopes.root.nextId", expr: "scopes.root.nextId + 1" },
      ],
    },
  },
  {
    id: "td-total-sum",
    component: "TableCell",
    op: "child",
    type: "element",
    children: ["total-sum-text"],
  },
  {
    id: "total-sum-text",
    component: "Text",
    op: "child",
    type: "element",
    props: { expr: "({children: scopes.root.totalSum})" },
    deps: ["scopes.root.totalSum"],
  },
  {
    id: "td-row-count",
    component: "TableCell",
    op: "child",
    type: "element",
    children: ["row-count-text"],
  },
  {
    id: "row-count-text",
    defaults: [
      {
        set: "scopes.root.foo",
        expr: "UserRPC_getUsers().then(u => u.length)",
      },
    ],
    component: "Text",
    op: "child",
    type: "element",
    props: {
      expr: '({children: scopes.root.rows.length + " rows " + scopes.root.foo })',
    },
    deps: ["scopes.root.rows"],
  },
] as const;
