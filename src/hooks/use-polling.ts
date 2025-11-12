import { useEffect, useRef, useState } from "react";
import { DatabasePollRPC } from "vovk-client";
/**
 * @example const [isPollingEnabled, setIsPollingEnabled] = usePolling(false);
 */
export const usePolling = (initialValue = false) => {
  const [isPollingEnabled, setIsPollingEnabled] = useState(initialValue);
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

  return [isPollingEnabled, setIsPollingEnabled] as const;
};
