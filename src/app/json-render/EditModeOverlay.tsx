"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

const HIGHLIGHT_OUTLINE = "0 0 0 2px #3b82f6";

function findDataIdAncestor(
  el: HTMLElement,
  container: HTMLElement,
): HTMLElement | null {
  let current: HTMLElement | null = el;
  while (current && current !== container) {
    if (current.dataset.id) return current;
    current = current.parentElement;
  }
  return null;
}

function highlightAll(container: HTMLElement, dataId: string) {
  const els = container.querySelectorAll<HTMLElement>(
    `[data-id="${CSS.escape(dataId)}"]`,
  );
  els.forEach((el) => {
    el.style.boxShadow = HIGHLIGHT_OUTLINE;
  });
}

function clearHighlights(container: HTMLElement) {
  const els = container.querySelectorAll<HTMLElement>("[data-id]");
  els.forEach((el) => {
    el.style.boxShadow = "";
  });
}

interface PopoverState {
  generatedId: string;
  rect: DOMRect;
}

export const EditModeOverlay = ({
  enabled,
  children,
}: {
  enabled: boolean;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [popover, setPopover] = useState<PopoverState | null>(null);
  const [editText, setEditText] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleMouseOver = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enabled || !containerRef.current) return;
      const target = findDataIdAncestor(
        e.target as HTMLElement,
        containerRef.current,
      );
      if (target) {
        clearHighlights(containerRef.current);
        highlightAll(containerRef.current, target.dataset.id!);
      }
    },
    [enabled],
  );

  const handleMouseOut = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enabled || !containerRef.current) return;
      const relatedTarget = e.relatedTarget as HTMLElement | null;
      if (!relatedTarget || !containerRef.current.contains(relatedTarget)) {
        clearHighlights(containerRef.current);
      }
    },
    [enabled],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enabled || !containerRef.current) return;
      const target = findDataIdAncestor(
        e.target as HTMLElement,
        containerRef.current,
      );
      if (target) {
        e.preventDefault();
        e.stopPropagation();
        const rect = target.getBoundingClientRect();
        setPopover({ generatedId: target.dataset.id!, rect });
        setEditText("");
      }
    },
    [enabled],
  );

  // Close popover on Escape
  useEffect(() => {
    if (!popover) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPopover(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [popover]);

  // Close popover when clicking outside of it
  useEffect(() => {
    if (!popover) return;
    const handleDocClick = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setPopover(null);
      }
    };
    // Use a timeout to avoid immediately closing from the same click
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleDocClick);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleDocClick);
    };
  }, [popover]);

  // Clear highlights when edit mode is disabled
  useEffect(() => {
    if (!enabled && containerRef.current) {
      clearHighlights(containerRef.current);
      setPopover(null);
    }
  }, [enabled]);

  // Compute popover position
  const popoverStyle: React.CSSProperties | undefined = popover
    ? (() => {
        const { rect } = popover;
        const top = rect.bottom + window.scrollY + 8;
        const left = rect.left + window.scrollX;
        return {
          position: "absolute" as const,
          top,
          left,
          zIndex: 9999,
        };
      })()
    : undefined;

  return (
    <div
      ref={containerRef}
      onMouseOver={enabled ? handleMouseOver : undefined}
      onMouseOut={enabled ? handleMouseOut : undefined}
      onClickCapture={enabled ? handleClick : undefined}
      style={enabled ? { cursor: "pointer" } : undefined}
    >
      {children}
      {popover &&
        createPortal(
          <div
            ref={popoverRef}
            style={popoverStyle}
            className="w-80 rounded-lg border bg-popover p-4 shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Edit this element</span>
              <button
                type="button"
                onClick={() => setPopover(null)}
                className="rounded-sm opacity-70 hover:opacity-100"
              >
                <X className="size-4" />
              </button>
            </div>
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="Describe your edit..."
              className="mb-3"
              rows={3}
            />
            <Button
              size="sm"
              className="w-full"
              onClick={() => {
                alert(popover.generatedId);
                setPopover(null);
              }}
            >
              Edit
            </Button>
          </div>,
          document.body,
        )}
    </div>
  );
};
