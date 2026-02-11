import { ChunkComponent } from "../types";

export const chartLines: ChunkComponent[] = [
  {
    id: "chart-root",
    op: "root",
    type: "element",
    component: "FlexCol",
    props: { literal: { gap: "4" } },
    defaults: [
      { set: "scopes.root.tasks", expr: "TaskRPC_getTasks()" },
      { set: "scopes.root.users", expr: "UserRPC_getUsers()" },
      {
        set: "scopes.root.barChartData",
        expr: '[{status: "TODO", count: String(scopes.root.tasks.filter(t => t.status === "TODO").length)}, {status: "In Progress", count: String(scopes.root.tasks.filter(t => t.status === "IN_PROGRESS").length)}, {status: "Done", count: String(scopes.root.tasks.filter(t => t.status === "DONE").length)}]',
      },
      {
        set: "scopes.root.pieChartData",
        expr: "scopes.root.users.map(u => ({name: u.fullName, value: scopes.root.tasks.filter(t => t.userId === u.id).length}))",
      },
    ],
    children: ["bar-card", "pie-card"],
  },
  {
    id: "bar-card",
    op: "child",
    type: "element",
    component: "Card",
    props: { literal: { title: "Tasks by Status" } },
    children: ["status-bar-chart"],
  },
  {
    id: "status-bar-chart",
    op: "child",
    type: "element",
    component: "BarChart",
    props: {
      expr: '({data: scopes.root.barChartData, xKey: "status", yKeys: ["count"], height: 300})',
    },
    deps: ["scopes.root.barChartData"],
  },
  {
    id: "pie-card",
    op: "child",
    type: "element",
    component: "Card",
    props: { literal: { title: "Tasks per User" } },
    defaults: [
      {
        set: "scopes.root.pieChartData",
        expr: "scopes.root.users.map(u => ({name: u.fullName, value: scopes.root.tasks.filter(t => t.userId === u.id).length}))",
      },
    ],
    children: ["user-pie-chart"],
  },
  {
    id: "user-pie-chart",
    op: "child",
    type: "element",
    component: "PieChart",
    props: {
      expr: "({data: scopes.root.pieChartData, height: 300, donut: true})",
    },
    deps: ["scopes.root.pieChartData"],
  },
] as const;
