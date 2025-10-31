import { z } from "zod";
import { publicProcedure } from "../../../create-context.ts";

export default publicProcedure
  .input(z.object({ name: z.string() }))
  .mutation(({ input }) => {
    return {
      hello: input.name,
      date: new Date(),
    };
  });