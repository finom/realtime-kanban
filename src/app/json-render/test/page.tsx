"use client";
import { useState } from "react";
import { componentRenderers } from "../registry/renderers";
import NoSSR from "react-no-ssr";
import { JsonRenderRPC } from "vovk-client";
import {
  useQuery,
  experimental_streamedQuery as streamedQuery,
} from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { VovkYieldType } from "vovk";

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [data, setData] = useState<
    VovkYieldType<typeof JsonRenderRPC.render>[]
  >([]);
  const [status, setStatus] = useState<"idle" | "fetching" | "error">("idle");

  const isFetching = status === "fetching";

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setStatus("fetching");
    const stream = await JsonRenderRPC.render({
      body: {
        prompt,
      },
      interpretAs: "application/jsonlines",
    });
    try {
      for await (const chunk of stream) {
        setData((prev) => [...prev, chunk]);
      }
      setStatus("idle");
    } catch (error) {
      console.error("Error while streaming:", error);
      setStatus("error");
    }
  };

  return (
    <NoSSR>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex gap-2">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button
            onClick={handleSubmit}
            disabled={isFetching || !prompt.trim()}
          >
            {isFetching ? "Generating..." : "Generate"}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="edit-mode"
            checked={editMode}
            onCheckedChange={setEditMode}
          />
          <Label htmlFor="edit-mode">Edit Mode</Label>
        </div>
        <div className={isFetching ? "opacity-50" : ""}>
          <componentRenderers.Renderer lines={data} editMode={editMode} />
        </div>
      </div>
    </NoSSR>
  );
}
