"use client";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import Link from "next/link";
import { usePolling } from "@/hooks/use-polling";

const AppHeader = () => {
  const [isPollingEnabled, setIsPollingEnabled] = usePolling(false);

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
