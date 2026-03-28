import { createFetcher, HttpStatus } from 'vovk';

type OnSuccessHandler = (
  data: unknown,
  options: { bypassRegistry?: boolean },
) => void | Promise<void>;

// TODO: Replace with built-in fetcher.onSuccess once supported by Vovk
const onSuccessHandlers: OnSuccessHandler[] = [];

const _fetcher = createFetcher<{ bypassRegistry?: boolean }>({
  onSuccess: async (data, options) => {
    for (const handler of onSuccessHandlers) {
      handler(data, options);
    }
  },
  onError: (error) => {
    if (error.statusCode === HttpStatus.UNAUTHORIZED) {
      document.location.href = '/login';
    }
  },
});

export const fetcher = Object.assign(_fetcher, {
  onSuccess: (handler: OnSuccessHandler) => {
    onSuccessHandlers.push(handler);
  },
});
