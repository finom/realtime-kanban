"use client";

import { ChunkComponent } from "./types";
import { componentsRegistry } from "./registry";
import NoSSR from "react-no-ssr";
import { use } from "react";
import { getPartialFnPrompt } from "./evaluate";
import INSTRUCTIONS from "./INSTRUCTIONS.json" assert { type: "json" };
import { get } from "lodash";

const countLines: ChunkComponent[] = [
  {
    id: "card1",
    op: "root",
    type: "element",
    component: "Card",
    props: { expr: '{ "children": scopes.root.count }' },
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
    props: { expr: '{ "children": scopes.root.count }' },
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
    props: {
      expr: '{ "value": dyn(scopes.root.count), "label": dyn("Count"), "type": dyn("number") }',
    },
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
    items: { expr: "scopes.root.items" },
    props: { expr: '{ "children": scopes.itemScope.item }' },
  },
  {
    id: "add-item-button",
    op: "child",
    type: "element",
    component: "Button",
    props: { literal: { children: "Add Item" } },
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
    props: { literal: { text: "A" } },
  },
  {
    id: "th-b",
    component: "Th",
    op: "child",
    type: "element",
    props: { literal: { text: "B" } },
  },
  {
    id: "th-sum",
    component: "Th",
    op: "child",
    type: "element",
    props: { literal: { text: "Sum" } },
  },
  {
    id: "th-actions",
    component: "Th",
    op: "child",
    type: "element",
    props: { literal: { text: "Actions" } },
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
    idKey: "id",
    items: { expr: "scopes.root.rows" },
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
    props: { expr: '{"value": scopes.row.item.a}' },
    deps: ["scopes.row.item.a"],
    callbacks: {
      onChange: [
        { set: "scopes.row.item.a", expr: "evt.value" },
        {
          set: "scopes.root.totalSum",
          expr: "reduce(scopes.root.childScopes.row, 0.0, acc, r, acc + double(r.item.a) + double(r.item.b))",
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
    props: { expr: '{"value": scopes.row.item.b}' },
    deps: ["scopes.row.item.b"],
    callbacks: {
      onChange: [
        { set: "scopes.row.item.b", expr: "evt.value" },
        {
          set: "scopes.root.totalSum",
          expr: "reduce(scopes.root.childScopes.row, 0.0, acc, r, acc + double(r.item.a) + double(r.item.b))",
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
    props: {
      expr: '{"value": double(scopes.row.item.a) + double(scopes.row.item.b)}',
    },
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
    props: { literal: { text: "Delete" } },
    callbacks: {
      onClick: [
        {
          set: "scopes.root.rows",
          expr: "scopes.root.rows.filter(r, r.id != scopes.row.item.id)",
        },
        {
          set: "scopes.root.totalSum",
          expr: "reduce(scopes.root.childScopes.row, 0.0, acc, r, acc + double(r.item.a) + double(r.item.b))",
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
    props: { literal: { text: "Total" } },
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
    props: { literal: { text: "+ Add Row" } },
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
    props: { expr: '{"value": scopes.root.totalSum}' },
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
    defaults: [
      {
        set: "scopes.root.foo",
        expr: "size(UserRPC_getUsers())",
      },
    ],
    component: "Text",
    op: "child",
    type: "element",
    props: {
      expr: '{"value": string(size(scopes.root.rows)) + " rows " + string(scopes.root.foo) }',
    },
    deps: ["scopes.root.rows"],
  },
] as const;

const asyncLines: ChunkComponent[] = [
  {
    id: "users-table",
    component: "Table",
    op: "root",
    type: "element",
    defaults: [
      {
        set: "scopes.root.users",
        expr: "UserRPC_getUsers()",
      },
    ],
    children: ["users-thead", "users-tbody"],
  },
  {
    id: "users-thead",
    component: "Thead",
    op: "child",
    type: "element",
    children: ["users-header-row"],
  },
  {
    id: "users-header-row",
    component: "Tr",
    op: "child",
    type: "element",
    children: ["th-name", "th-email"],
  },
  {
    id: "th-name",
    component: "Th",
    op: "child",
    type: "element",
    props: { literal: { text: "Name" } },
  },
  {
    id: "th-email",
    component: "Th",
    op: "child",
    type: "element",
    props: { literal: { text: "Email" } },
  },
  {
    id: "users-tbody",
    component: "Tbody",
    op: "child",
    type: "element",
    children: ["user-rows"],
  },
  {
    id: "user-rows",
    component: "Tr",
    op: "child",
    type: "list",
    idKey: "id",
    items: { expr: "scopes.root.users" },
    itemScope: "user",
    children: ["td-name", "td-email"],
  },
  {
    id: "td-name",
    component: "Td",
    op: "child",
    type: "element",
    children: ["name-text"],
  },
  {
    id: "name-text",
    component: "Text",
    op: "child",
    type: "element",
    props: { expr: '{"value": scopes.user.item.fullName}' },
    deps: ["scopes.user.item.fullName"],
  },
  {
    id: "td-email",
    component: "Td",
    op: "child",
    type: "element",
    children: ["email-text"],
  },
  {
    id: "email-text",
    component: "Text",
    op: "child",
    type: "element",
    props: { expr: '{"value": scopes.user.item.email}' },
    deps: ["scopes.user.item.email"],
  },
] as const;

function getPrompt() {
  return `
${INSTRUCTIONS}

${getPartialFnPrompt()}

${componentsRegistry.getDefPartialPrompt()}

# EXAMPLES:
## COUNTER:
${countLines.map((line) => JSON.stringify(line)).join("\n")}
## FORM WITH INPUT:
${formLines.map((line) => JSON.stringify(line)).join("\n")}
## DYNAMIC LIST:
${listLines.map((line) => JSON.stringify(line)).join("\n")}
## TABLE WITH COMPUTED COLUMNS, ADD/REMOVE ROWS:
${tableChunks.map((line) => JSON.stringify(line)).join("\n")}
## ASYNC DATA FETCHING (USERS TABLE):
${asyncLines.map((line) => JSON.stringify(line)).join("\n")}
`;
}

export default function Page() {
  return (
    <NoSSR>
      <pre className="p-4">{getPrompt()}</pre>
      <componentsRegistry.Renderer lines={countLines} />
      <componentsRegistry.Renderer lines={formLines} />
      <componentsRegistry.Renderer lines={listLines} />
      <componentsRegistry.Renderer lines={tableChunks} />
      <componentsRegistry.Renderer lines={asyncLines} />
    </NoSSR>
  );
}

/**

TODO
- Define async functions for CEL with description, parameters, return type?
- Placeholder logic, while loading async defaults
- Make edits to a specific component in the tree
- Entity registry and voice control
- Rerender lines on CEL error (rerender loop)
- Form data for files
- Visibility
- e2e tests
- Sort, reverse <- custom CEL functions
- Loading/error states
- Pluralization function (item/items) ??
- Multi-step flows / tabs / navigation - CLAUDE said that
- Disabled state


>  I'd say loading/error + disabled + dropdown are the three that would actually close the gap. Everything else falls out from those plus visibility.




Here's what I'd consider the complete set:
Layout: Card, Tabs, Accordion, Modal, Drawer, Divider, Grid, Stack, Spacer
Typography: Heading, Text, Badge, Label
Data Input: Input, Textarea, NumberInput, Select, MultiSelect, Checkbox, Radio, Switch, DatePicker, DateRangePicker, TimePicker, FileUpload, ColorPicker
Buttons & Actions: Button, IconButton, ButtonGroup, DropdownMenu
Data Display: Table, List, DataGrid (virtual scrolling for large datasets), Avatar, Icon, Tooltip, ProgressBar, Stat (label + big number + trend arrow), Tag, Image
Charts: BarChart, LineChart, PieChart, AreaChart, FunnelChart (critical for CRM pipelines)
Feedback: Alert, Toast, Skeleton (loading), Spinner, EmptyState
Navigation: Breadcrumb, Pagination, Stepper (wizard flows)
Overlay: Modal, Drawer, Popover, ConfirmDialog
That's roughly 45 components. For a CRM specifically I'd prioritize these as your launch set (gets you to 90%): Card, Tabs, Modal, Heading, Text, Badge, Input, Select, DatePicker, Checkbox, Button, DropdownMenu, Table, Stat, Icon, Tag, Alert, Skeleton, EmptyState, Pagination, ConfirmDialog, BarChart, LineChart, PieChart, FunnelChart.
That's 25 components. The rest you add when users ask for them.
*/
