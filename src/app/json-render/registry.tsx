import z from "zod";
import { createAIComponent } from "./createAIComponent";
import { createAIComponentRegistry } from "./createAIComponentRegistry";
import { pick } from "lodash";

const onClickSchema = z
  .object({
    pageX: z.number().meta({
      description:
        "The X coordinate of the click event relative to the element",
    }),
    pageY: z.number().meta({
      description:
        "The Y coordinate of the click event relative to the element",
    }),
    screenX: z.number().meta({
      description: "The X coordinate of the click event relative to the screen",
    }),
    screenY: z.number().meta({
      description: "The Y coordinate of the click event relative to the screen",
    }),
    clientX: z.number().meta({
      description:
        "The X coordinate of the click event relative to the viewport",
    }),
    clientY: z.number().meta({
      description:
        "The Y coordinate of the click event relative to the viewport",
    }),
  })
  .meta({ description: "Callback for when the element is clicked" });

function keys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

export const componentsRegistry = createAIComponentRegistry({
  Card: createAIComponent({
    description:
      "A container component with rounded corners, shadow, and border for grouping related content",
    propDefs: z.strictObject({
      title: z.string().optional(),
      padding: z.enum(["md", "sm"]).default("md"),
      children: z.any().optional(),
    }),
    callbackDefs: { onClick: onClickSchema },
    render: ({ title, padding, children, onClick }) => {
      return (
        <div
          title={title}
          onClick={(e) => onClick(pick(e, keys(onClickSchema.shape)))}
          className={`rounded-xl shadow-lg border border-gray-200 ${padding === "md" ? "p-6" : "p-4"}`}
        >
          {children}
        </div>
      );
    },
  }),
  Input: createAIComponent({
    description: "A text or number input field with an optional label",
    propDefs: z.strictObject({
      label: z.string().optional(),
      value: z.any(),
      type: z.enum(["text", "number"]).default("text"),
    }),
    callbackDefs: {
      onChange: z.strictObject({
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
    description: "An unordered list container",
    propDefs: z.strictObject({}),
    render: ({ children }) => {
      return <ul>{children}</ul>;
    },
  }),
  Li: createAIComponent({
    description: "A list item for use inside Ul",
    propDefs: z.strictObject({}),
    render: ({ children }) => {
      return <li>{children}</li>;
    },
  }),
  Button: createAIComponent({
    description: "A clickable button with customizable text",
    propDefs: z.strictObject({
      text: z.string().optional(),
    }),
    callbackDefs: { onClick: onClickSchema },
    render: ({ text, children, onClick }) => {
      return (
        <button
          onClick={(e) => onClick(pick(e, keys(onClickSchema.shape)))}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {text ?? children}
        </button>
      );
    },
  }),
  // Table components
  Table: createAIComponent({
    description: "A table container for displaying tabular data",
    propDefs: z.strictObject({}),
    render: ({ children }) => (
      <table className="w-full border-collapse border border-gray-300">
        {children}
      </table>
    ),
  }),
  Thead: createAIComponent({
    description: "Table header section container",
    propDefs: z.strictObject({}),
    render: ({ children }) => <thead className="">{children}</thead>,
  }),
  Tbody: createAIComponent({
    description: "Table body section container",
    propDefs: z.strictObject({}),
    render: ({ children }) => <tbody>{children}</tbody>,
  }),
  Tfoot: createAIComponent({
    description: "Table footer section container",
    propDefs: z.strictObject({}),
    render: ({ children }) => (
      <tfoot className=" font-semibold">{children}</tfoot>
    ),
  }),
  Tr: createAIComponent({
    description: "A table row",
    propDefs: z.strictObject({}),
    render: ({ children }) => (
      <tr className="border-b border-gray-200">{children}</tr>
    ),
  }),
  Th: createAIComponent({
    description: "A table header cell",
    propDefs: z.strictObject({
      text: z.string().optional(),
    }),
    render: ({ text, children }) => (
      <th className="px-4 py-2 text-left font-semibold">{text ?? children}</th>
    ),
  }),
  Td: createAIComponent({
    description: "A table data cell",
    propDefs: z.strictObject({
      text: z.string().optional(),
    }),
    render: ({ text, children }) => (
      <td className="px-4 py-2">{text ?? children}</td>
    ),
  }),
  NumberInput: createAIComponent({
    description: "A numeric input field for entering numbers",
    propDefs: z.strictObject({
      value: z.number(),
    }),
    callbackDefs: {
      onChange: z.strictObject({
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
    description:
      "A simple text display component that renders any value as a string",
    propDefs: z.strictObject({
      value: z.any(),
    }),
    render: ({ value }) => <span>{String(value)}</span>,
  }),
});
