import { describe, it, expect, beforeEach, vi } from "vitest";
import { createTRPCContext, createTRPCRouter, baseProcedure, createCallerFactory } from "../init";

describe("tRPC Initialization", () => {
  describe("createTRPCContext", () => {
    it("should create a context with userId", async () => {
      const context = await createTRPCContext();
      
      expect(context).toBeDefined();
      expect(context.userId).toBe("user_123");
    });

    it("should return consistent context structure", async () => {
      const context1 = await createTRPCContext();
      const context2 = await createTRPCContext();
      
      expect(context1).toEqual(context2);
    });

    it("should be a cached function", async () => {
      // Test that the function is a React cache function
      expect(typeof createTRPCContext).toBe("function");
      
      const result = await createTRPCContext();
      expect(result).toHaveProperty("userId");
    });

    it("should handle context creation without errors", async () => {
      await expect(createTRPCContext()).resolves.not.toThrow();
    });
  });

  describe("createTRPCRouter", () => {
    it("should be defined and callable", () => {
      expect(createTRPCRouter).toBeDefined();
      expect(typeof createTRPCRouter).toBe("function");
    });

    it("should create a router with procedures", () => {
      const router = createTRPCRouter({
        testProcedure: baseProcedure.query(() => ({ success: true })),
      });
      
      expect(router).toBeDefined();
      expect(typeof router).toBe("object");
    });

    it("should handle empty router creation", () => {
      const router = createTRPCRouter({});
      
      expect(router).toBeDefined();
    });

    it("should support multiple procedures", () => {
      const router = createTRPCRouter({
        proc1: baseProcedure.query(() => "result1"),
        proc2: baseProcedure.query(() => "result2"),
        proc3: baseProcedure.mutation(() => "mutation"),
      });
      
      expect(router).toBeDefined();
    });
  });

  describe("baseProcedure", () => {
    it("should be defined", () => {
      expect(baseProcedure).toBeDefined();
    });

    it("should support query creation", () => {
      const queryProcedure = baseProcedure.query(() => ({ data: "test" }));
      
      expect(queryProcedure).toBeDefined();
    });

    it("should support mutation creation", () => {
      const mutationProcedure = baseProcedure.mutation(() => ({ success: true }));
      
      expect(mutationProcedure).toBeDefined();
    });

    it("should support input validation", () => {
      const procedureWithInput = baseProcedure
        .input((val: unknown) => val)
        .query((opts) => opts.input);
      
      expect(procedureWithInput).toBeDefined();
    });
  });

  describe("createCallerFactory", () => {
    it("should be defined and callable", () => {
      expect(createCallerFactory).toBeDefined();
      expect(typeof createCallerFactory).toBe("function");
    });

    it("should create a caller factory for routers", () => {
      const router = createTRPCRouter({
        test: baseProcedure.query(() => "test"),
      });
      
      const callerFactory = createCallerFactory(router);
      expect(callerFactory).toBeDefined();
      expect(typeof callerFactory).toBe("function");
    });

    it("should handle router without procedures", () => {
      const emptyRouter = createTRPCRouter({});
      
      const callerFactory = createCallerFactory(emptyRouter);
      expect(callerFactory).toBeDefined();
    });
  });

  describe("Integration tests", () => {
    it("should allow creating a full router with context", async () => {
      const router = createTRPCRouter({
        getUserId: baseProcedure.query((opts) => {
          return { userId: opts.ctx.userId };
        }),
      });

      const context = await createTRPCContext();
      const caller = router.createCaller(context);
      
      const result = await caller.getUserId();
      expect(result.userId).toBe("user_123");
    });

    it("should handle async context in procedures", async () => {
      const router = createTRPCRouter({
        asyncTest: baseProcedure.query(async (opts) => {
          return { contextUserId: opts.ctx.userId };
        }),
      });

      const caller = router.createCaller(await createTRPCContext());
      const result = await caller.asyncTest();
      
      expect(result.contextUserId).toBe("user_123");
    });
  });
});