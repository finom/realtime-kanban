"use client";
import { useCallback, useEffect, useState } from "react";
import { componentRenderers } from "../registry/renderers";
import NoSSR from "react-no-ssr";
import { JsonRenderRPC } from "vovk-client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { VovkYieldType } from "vovk";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type ChunkLine = VovkYieldType<typeof JsonRenderRPC.render>;

const STORAGE_KEY = "json-render-state";

function loadFromStorage(): {
  lines: ChunkLine[];
  previousPrompt: string;
} | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      Array.isArray(parsed.lines) &&
      typeof parsed.previousPrompt === "string"
    ) {
      return parsed;
    }
  } catch {
    // ignore
  }
  return null;
}

function saveToStorage(lines: ChunkLine[], previousPrompt: string) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ lines, previousPrompt }),
    );
  } catch {
    // ignore
  }
}

function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

type AppStatus =
  | "idle"
  | "clarifying"
  | "awaiting-confirmation"
  | "generating"
  | "editing"
  | "error";

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [data, setData] = useState<ChunkLine[]>([]);
  const [status, setStatus] = useState<AppStatus>("idle");
  const [previousPrompt, setPreviousPrompt] = useState("");
  const [clarification, setClarification] = useState("");
  const [showClarifyDialog, setShowClarifyDialog] = useState(false);
  const [editingElementId, setEditingElementId] = useState<string | null>(null);

  // Restore from localStorage on mount
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) {
      setData(stored.lines);
      setPreviousPrompt(stored.previousPrompt);
    }
  }, []);

  // Save to localStorage when data changes (only after generation is complete)
  const saveCurrentState = useCallback(
    (lines: ChunkLine[], prompt: string) => {
      saveToStorage(lines, prompt);
    },
    [],
  );

  // === Core generation logic (shared by submit and generate) ===
  const runGeneration = useCallback(
    async (existingLines?: ChunkLine[], prevPrompt?: string) => {
      setShowClarifyDialog(false);
      setStatus("generating");

      // Clear existing data for full regeneration
      setData([]);

      try {
        const stream = await JsonRenderRPC.render({
          body: {
            prompt,
            existingLines,
            previousPrompt: prevPrompt,
          },
          interpretAs: "application/jsonlines",
        });

        const newLines: ChunkLine[] = [];
        for await (const chunk of stream) {
          newLines.push(chunk);
          setData([...newLines]);
        }

        setPreviousPrompt(prompt);
        saveCurrentState(newLines, prompt);
        setStatus("idle");
      } catch (error) {
        console.error("Generation error:", error);
        setStatus("error");
      }
    },
    [prompt, saveCurrentState],
  );

  // === FLOW 1: Full Generation with Clarification ===
  const handleSubmit = useCallback(async () => {
    if (!prompt.trim()) return;

    const existingLines = data.length > 0 ? data : undefined;
    const prevPrompt = previousPrompt || undefined;

    // Step 1: Clarification
    setStatus("clarifying");
    setClarification("");

    try {
      const result = await JsonRenderRPC.clarify({
        body: {
          prompt,
          existingLines,
          previousPrompt: prevPrompt,
        },
      });

      setClarification(result.text);

      // Show the clarification dialog
      setStatus("awaiting-confirmation");
      setShowClarifyDialog(true);
    } catch (error) {
      console.error("Clarification error:", error);
      // Fall through to direct generation on clarification failure
      runGeneration(existingLines, prevPrompt);
    }
  }, [prompt, data, previousPrompt, runGeneration]);

  // Step 2: Confirmed generation (after clarification)
  const handleGenerate = useCallback(async () => {
    const existingLines = data.length > 0 ? data : undefined;
    const prevPrompt = previousPrompt || undefined;
    runGeneration(existingLines, prevPrompt);
  }, [data, previousPrompt, runGeneration]);

  // Cancel clarification
  const handleCancelClarify = useCallback(() => {
    setShowClarifyDialog(false);
    setStatus("idle");
    setClarification("");
  }, []);

  // === FLOW 2: Element Edit ===
  const handleEdit = useCallback(
    async (elementId: string, editText: string) => {
      if (!editText.trim() || data.length === 0) return;

      setEditingElementId(elementId);
      setStatus("editing");
      // Turn off edit mode during generation so user sees the update
      setEditMode(false);

      try {
        const stream = await JsonRenderRPC.render({
          body: {
            prompt: editText,
            editElementId: elementId,
            existingLines: data,
            previousPrompt,
          },
          interpretAs: "application/jsonlines",
        });

        // Append replacement chunks to existing data.
        // buildElementsById (in the Renderer) handles deduplication:
        // when a chunk with the same id appears, it replaces the old one
        // and removes all its old descendants.
        let currentData = [...data];
        for await (const chunk of stream) {
          currentData = [...currentData, chunk];
          setData(currentData);
        }

        saveCurrentState(currentData, previousPrompt);
        setEditingElementId(null);
        setStatus("idle");
      } catch (error) {
        console.error("Edit error:", error);
        setEditingElementId(null);
        setStatus("error");
      }
    },
    [data, previousPrompt, saveCurrentState],
  );

  // === Clear / Reset ===
  const handleClear = useCallback(() => {
    setData([]);
    setPreviousPrompt("");
    setPrompt("");
    setClarification("");
    clearStorage();
    setStatus("idle");
  }, []);

  const isBusy =
    status === "clarifying" ||
    status === "generating" ||
    status === "editing" ||
    status === "awaiting-confirmation";

  const statusLabel: Record<AppStatus, string> = {
    idle: "Generate",
    clarifying: "Analyzing...",
    "awaiting-confirmation": "Generate",
    generating: "Generating...",
    editing: "Editing...",
    error: "Generate",
  };

  return (
    <NoSSR>
      <div className="flex flex-col gap-4 p-4 max-w-6xl mx-auto">
        {/* Prompt Input */}
        <div className="flex gap-2">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              data.length > 0
                ? "Describe changes to the existing UI, or enter a new prompt..."
                : "Describe the UI you want to build..."
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={isBusy}
            rows={3}
          />
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSubmit}
              disabled={isBusy || !prompt.trim()}
              className="flex-1"
            >
              {statusLabel[status]}
            </Button>
            {data.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                disabled={isBusy}
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Edit Mode Toggle + Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="edit-mode"
              checked={editMode}
              onCheckedChange={setEditMode}
              disabled={data.length === 0 || isBusy}
            />
            <Label htmlFor="edit-mode">Edit Mode</Label>
          </div>
          {previousPrompt && (
            <span className="text-xs text-muted-foreground">
              Previous: &quot;{previousPrompt.slice(0, 80)}
              {previousPrompt.length > 80 ? "..." : ""}&quot;
            </span>
          )}
          {editingElementId && (
            <span className="text-xs text-blue-500">
              Editing: {editingElementId}
            </span>
          )}
          {status === "error" && (
            <span className="text-xs text-red-500">
              An error occurred. Try again.
            </span>
          )}
        </div>

        {/* Rendered UI */}
        <div className={isBusy ? "opacity-60 pointer-events-none" : ""}>
          {data.length > 0 ? (
            <componentRenderers.Renderer
              lines={data}
              editMode={editMode}
              onEdit={handleEdit}
            />
          ) : (
            <div className="text-center text-muted-foreground py-16 border border-dashed rounded-lg">
              {status === "generating"
                ? "Generating UI..."
                : "Enter a prompt to generate a UI"}
            </div>
          )}
        </div>
      </div>

      {/* Clarification Dialog */}
      <Dialog open={showClarifyDialog} onOpenChange={setShowClarifyDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Generation Plan</DialogTitle>
            <DialogDescription>
              Review the AI&apos;s plan before generating.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
            {clarification || "Analyzing your request..."}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCancelClarify}>
              Cancel
            </Button>
            <Button onClick={handleGenerate} disabled={!clarification}>
              Proceed with Generation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </NoSSR>
  );
}
