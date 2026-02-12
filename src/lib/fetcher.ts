import { createFetcher, HttpStatus } from "vovk";
import { toast } from "sonner";
import useRegistry from "@/hooks/useRegistry";

export const fetcher = createFetcher<{ bypassRegistry?: boolean }>({
  transformResponse: async (data, { bypassRegistry }) => {
    if (bypassRegistry) {
      return data;
    }
    const state = useRegistry.getState();
    if (
      data &&
      typeof data === "object" &&
      Symbol.asyncIterator in data &&
      "onIterate" in data &&
      typeof data.onIterate === "function"
    ) {
      data.onIterate(state.parse); // handle each item in the async iterable
      return data;
    }

    state.parse(data); // parse regular JSON data
    return data;
  },
  onError: (error, _, { schema }) => {
    if (error.statusCode === HttpStatus.UNAUTHORIZED) {
      document.location.href = "/login";
    } else {
      const errorToast =
        schema.operationObject?.["x-errorToast"] ?? "An unknown error occurred";
      toast.error(errorToast);
    }
  },
  onSuccess: (_, __, { schema }) => {
    const successToast = schema.operationObject?.["x-successToast"];
    if (successToast) {
      toast.success(successToast);
    }
  },
});
