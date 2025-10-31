import { Hono } from "hono";
import { handle } from "hono/vercel";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "../backend/trpc/app-router";
import { createContext } from "../backend/trpc/create-context";

const app = new Hono().basePath("/api");

app.use("*", cors());

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext,
  })
);

app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

app.get("/test", (c) => {
  return c.json({ message: "Test endpoint working" });
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handle(app);