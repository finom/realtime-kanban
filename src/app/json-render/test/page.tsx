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

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [submittedPrompt, setSubmittedPrompt] = useState<string>('');

  const { data, fetchStatus } = useQuery({
    queryKey: JsonRenderRPC.render.queryKey([submittedPrompt]),
    queryFn: streamedQuery({
      streamFn: async () =>
        await JsonRenderRPC.render({
          body: {
            prompt: submittedPrompt,
          },
          interpretAs: "application/jsonlines",
        }),
    }),
    enabled: submittedPrompt !== '',
  });

  const isFetching = fetchStatus === "fetching";

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    setSubmittedPrompt(prompt);
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
          <Button onClick={handleSubmit} disabled={isFetching || !prompt.trim()}>
            {isFetching ? "Generating..." : "Generate"}
          </Button>
        </div>
        <div className={isFetching ? "opacity-50" : ""}>
          <componentRenderers.Renderer lines={data ?? []} />
        </div>
      </div>
    </NoSSR>
  );
}
