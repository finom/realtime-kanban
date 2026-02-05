import z from "zod";
import { createAIComponent } from "./createAIComponent";
import { createAIComponentRegistry } from "./createAIComponentRegistry";

export const registry = createAIComponentRegistry({
  Card: createAIComponent({
    propDefs: z.object({
      title: z.string().optional(),
      padding: z.enum(["md", "sm"]).default("md"),
      children: z.any().optional(),
    }),
    callbacks: {
      onClick: z.object({ x: z.any().optional() }),
    },
    render: ({ title, padding, children, onClick }) => {
      return (
        <div
          title={title}
          onClick={() => onClick({ x: 0 })}
          className={`rounded-xl shadow-lg border border-gray-200 ${padding === "md" ? "p-6" : "p-4"}`}
        >
          {children}
        </div>
      );
    },
  }),
  Input: createAIComponent({
    propDefs: z.object({
      label: z.string().optional(),
      value: z.any(),
      type: z.enum(["text", "number"]).default("text"),
    }),
    callbacks: {
      onChange: z.object({
        value: z
          .string()
          .meta({ description: "The current value of the input" }),
        valueAsNumber: z.number().meta({
          description:
            "The current value of the input as a number, if NaN then 0",
        }),
      }),
    },
    render: ({ label, value, type = "text", onChange }) => {
      return (
        <div className="flex flex-col gap-1">
          {label && (
            <label className="text-sm font-medium text-gray-700">{label}</label>
          )}
          <input
            type={type}
            value={value as string | number | readonly string[] | undefined}
            onChange={(e) => {
              onChange?.({
                value: e.target.value,
                valueAsNumber: e.target.valueAsNumber || 0,
              });
            }}
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
      );
    },
  }),
  Ul: createAIComponent({
    propDefs: z.object({}),
    render: ({ children }) => {
      return <ul>{children}</ul>;
    },
  }),
  Li: createAIComponent({
    propDefs: z.object({}),
    render: ({ children }) => {
      return <li>{children}</li>;
    },
  }),
  Button: createAIComponent({
    propDefs: z.object({
      text: z.string().optional(),
    }),
    callbacks: {
      onClick: z.object({}),
    },
    render: ({ text, children, onClick }) => {
      return (
        <button
          onClick={() => onClick({})}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {text ?? children}
        </button>
      );
    },
  }),
  // Table components
  Table: createAIComponent({
    propDefs: z.object({}),
    render: ({ children }) => (
      <table className="w-full border-collapse border border-gray-300">
        {children}
      </table>
    ),
  }),
  Thead: createAIComponent({
    propDefs: z.object({}),
    render: ({ children }) => <thead className="">{children}</thead>,
  }),
  Tbody: createAIComponent({
    propDefs: z.object({}),
    render: ({ children }) => <tbody>{children}</tbody>,
  }),
  Tfoot: createAIComponent({
    propDefs: z.object({}),
    render: ({ children }) => (
      <tfoot className=" font-semibold">{children}</tfoot>
    ),
  }),
  Tr: createAIComponent({
    propDefs: z.object({}),
    render: ({ children }) => (
      <tr className="border-b border-gray-200">{children}</tr>
    ),
  }),
  Th: createAIComponent({
    propDefs: z.object({
      text: z.string().optional(),
    }),
    render: ({ text, children }) => (
      <th className="px-4 py-2 text-left font-semibold">{text ?? children}</th>
    ),
  }),
  Td: createAIComponent({
    propDefs: z.object({
      text: z.string().optional(),
    }),
    render: ({ text, children }) => (
      <td className="px-4 py-2">{text ?? children}</td>
    ),
  }),
  NumberInput: createAIComponent({
    propDefs: z.object({
      value: z.number(),
    }),
    callbacks: {
      onChange: z.object({
        value: z.number(),
      }),
    },
    render: ({ value, onChange }) => (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange({ value: e.target.valueAsNumber || 0 })}
        className="w-20 border border-gray-300 rounded px-2 py-1 text-center"
      />
    ),
  }),
  Text: createAIComponent({
    propDefs: z.object({
      value: z.any(),
    }),
    render: ({ value }) => <span>{String(value)}</span>,
  }),
});
