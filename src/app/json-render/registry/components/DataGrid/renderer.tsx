import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { DataGridDef } from "./def";

export const DataGridRenderer = createAIComponentRenderer({
  def: DataGridDef,
  renderer: ({
    columns = [],
    rows = [],
    maxHeight = "400px",
    striped = true,
    onRowClick,
    generatedId,
  }) => {
    return (
      <div
        className="rounded-md border overflow-hidden"
        data-id={generatedId}
      >
        <div className="overflow-auto" style={{ maxHeight }}>
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-muted">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-3 py-2 text-left font-medium text-muted-foreground border-b"
                    style={col.width ? { width: col.width } : undefined}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`border-b transition-colors hover:bg-accent/50 cursor-pointer ${
                    striped && rowIndex % 2 === 1 ? "bg-muted/30" : ""
                  }`}
                  onClick={() => onRowClick?.({ rowIndex, row })}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-3 py-2">
                      {String(row[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
});
