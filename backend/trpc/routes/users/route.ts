import { z } from "zod";
import { publicProcedure } from "../../create-context.ts";

export const createUser = publicProcedure
  .input(
    z.object({
      name: z.string().optional(),
      email: z.string().email(),
      phone: z.string().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.create({
      data: input,
    });
    return user;
  });

export const getUserById = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: input.id },
    });
    return user;
  });

export const getUserByEmail = publicProcedure
  .input(z.object({ email: z.string().email() }))
  .query(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { email: input.email },
    });
    return user;
  });