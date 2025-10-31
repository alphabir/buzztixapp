import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_WORK_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_WORK_API_BASE_URL;
  }

  throw new Error(
    "No base url found, please set EXPO_PUBLIC_WORK_API_BASE_URL"
  );
};

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/trpc`,  // Changed from /api/trpc to /trpc
      transformer: superjson,
      // Add fetch implementation for web compatibility
      fetch: typeof window !== 'undefined' ? window.fetch : undefined,
    }),
  ],
});