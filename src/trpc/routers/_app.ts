import { baseProcedure, createTRPCRouter } from "../init";
import prisma from "@/lib/db";

export const appRouter = createTRPCRouter({
  getUsers: baseProcedure.query((opts) => {
    return {};
  }),
});

export type AppRouter = typeof appRouter;
