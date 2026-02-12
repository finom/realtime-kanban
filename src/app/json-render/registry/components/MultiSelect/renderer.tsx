"use client";
import { useState } from "react";
import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, X } from "lucide-react";
import { MultiSelectDef } from "./def";

export const MultiSelectRenderer = createAIComponentRenderer({
  def: MultiSelectDef,
  renderer: ({
    value = [],
    options = [],
    placeholder,
    disabled = false,
    onChange,
    generatedId,
  }) => {
    const [open, setOpen] = useState(false);
    const selectedLabels = options.filter((o) => value.includes(o.value));

    const toggle = (optValue: string) => {
      const next = value.includes(optValue)
        ? value.filter((v) => v !== optValue)
        : [...value, optValue];
      onChange?.({ value: next });
    };

    return (
      <div className="relative" data-id={generatedId}>
        <button
          type="button"
          disabled={disabled}
          className="border-input flex min-h-9 w-full items-center justify-between gap-1 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 flex-wrap"
          onClick={() => setOpen(!open)}
        >
          <span className="flex flex-wrap gap-1 flex-1">
            {selectedLabels.length > 0 ? (
              selectedLabels.map((opt) => (
                <Badge key={opt.value} variant="secondary" className="gap-1 text-xs">
                  {opt.label}
                  <button
                    type="button"
                    className="ml-0.5 rounded-full hover:bg-foreground/20 p-0.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(opt.value);
                    }}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">
                {placeholder ?? "Select..."}
              </span>
            )}
          </span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-1 shadow-md">
            {options.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent"
              >
                <Checkbox
                  checked={value.includes(opt.value)}
                  onCheckedChange={() => toggle(opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        )}
      </div>
    );
  },
});
