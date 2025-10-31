import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import prisma from "../db/client.ts";

export const createContext = async (opts: any) => {
  return {
    req: opts.req,
    prisma,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;