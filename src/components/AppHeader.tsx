"use client";

import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { useEffect, useRef, useState } from "react";
import { DatabasePollRPC } from "vovk-client";
import Link from "next/link";

const AppHeader = () => {
  const [isPollingEnabled, setIsPollingEnabled] = useState(false);
  const pollingAbortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const isEnabled = localStorage.getItem("isPollingEnabled");
    setIsPollingEnabled(isEnabled === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("isPollingEnabled", isPollingEnabled.toString());
    async function poll(retries = 0) {
      if (!isPollingEnabled) {
        pollingAbortControllerRef.current?.abort();
        return;
      }
      try {
        while (true) {
          console.log("START POLLING");
          const iterable = await DatabasePollRPC.poll();
          pollingAbortControllerRef.current = iterable.abortController;

          for await (const iteration of iterable) {
            console.log("New DB update:", iteration);
          }
        }
      } catch (error) {
        if (
          retries < 5 &&
          (error as Error & { cause?: Error }).cause?.name !== "AbortError"
        ) {
          console.error("Polling failed, retrying...", error);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          return poll(retries + 1);
        }
      }
    }

    void poll();

    return () => {
      pollingAbortControllerRef.current?.abort();
    };
  }, [isPollingEnabled]);
  return (
    <header className="space-y-4 w-full bg-background/50 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-2 min-h-16 flex items-center gap-12">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-foreground">
            🪣&nbsp;&nbsp;Realtime Kanban
          </h1>
          <Link
            href="https://vovk.dev"
            className="opacity-60 hover:underline text-xs"
          >
            by Vovk.ts
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="poll-mode"
            checked={isPollingEnabled}
            onCheckedChange={setIsPollingEnabled}
          />
          <Label htmlFor="poll-mode">Database Polling</Label>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
