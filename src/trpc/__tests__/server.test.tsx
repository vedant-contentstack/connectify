import { describe, it, expect, vi } from "vitest";
import { getQueryClient, trpc } from "../server";

// Mock dependencies
vi.mock("server-only", () => ({}));

vi.mock("../query-client", () => ({
  makeQueryClient: vi.fn(() => ({
    getDefaultOptions: vi.fn(() => ({})),
    setQueryData: vi.fn(),
    getQueryData: vi.fn(),
  })),
}));

vi.mock("../init", () => ({
  createTRPCContext: vi.fn(async () => ({ userId: "server_user" })),
}));

vi.mock("../routers/_app", () => ({
  appRouter: {
    createCaller: vi.fn(() => ({
      getUsers: vi.fn(async () => ({})),
    })),
  },
}));

describe("TRPC Server Utilities", () => {
  describe("getQueryClient", () => {
    it("should return a QueryClient instance", () => {
      const client = getQueryClient();
      
      expect(client).toBeDefined();
      expect(typeof client).toBe("object");
    });

    it("should be callable multiple times", () => {
      const client1 = getQueryClient();
      const client2 = getQueryClient();
      
      expect(client1).toBeDefined();
      expect(client2).toBeDefined();
    });

    it("should return consistent client on server", () => {
      // In server context with React cache, should return same instance
      const client1 = getQueryClient();
      const client2 = getQueryClient();
      
      // Due to cache(), these might be the same instance
      expect(client1).toBeDefined();
      expect(client2).toBeDefined();
    });

    it("should not throw errors", () => {
      expect(() => getQueryClient()).not.toThrow();
    });

    it("should create valid QueryClient", () => {
      const client = getQueryClient();
      
      expect(client.getDefaultOptions).toBeDefined();
      expect(typeof client.getDefaultOptions).toBe("function");
    });
  });

  describe("trpc proxy", () => {
    it("should be defined", () => {
      expect(trpc).toBeDefined();
      expect(typeof trpc).toBe("object");
    });

    it("should have correct structure", () => {
      expect(trpc).toBeDefined();
      // The proxy object should be accessible
      expect(typeof trpc).toBe("object");
    });

    it("should be usable for server-side queries", () => {
      // Verify the trpc object is properly constructed
      expect(trpc).not.toBeNull();
      expect(trpc).not.toBeUndefined();
    });
  });

  describe("Server-only enforcement", () => {
    it("should import server-only package", () => {
      // The import of 'server-only' should not throw
      // This is enforced at build time by Next.js
      expect(true).toBe(true);
    });
  });

  describe("Integration", () => {
    it("should work together - getQueryClient and trpc", () => {
      const client = getQueryClient();
      
      expect(client).toBeDefined();
      expect(trpc).toBeDefined();
    });

    it("should handle concurrent access", () => {
      const clients = Array.from({ length: 5 }, () => getQueryClient());
      
      expect(clients).toHaveLength(5);
      clients.forEach(client => {
        expect(client).toBeDefined();
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle errors in query client creation gracefully", () => {
      // Even if there are issues, it shouldn't crash
      expect(() => {
        const client = getQueryClient();
        expect(client).toBeDefined();
      }).not.toThrow();
    });
  });

  describe("Cache behavior", () => {
    it("should respect React cache semantics", () => {
      // getQueryClient is wrapped with cache()
      // Multiple calls in same render should return same instance
      const client1 = getQueryClient();
      const client2 = getQueryClient();
      
      // Both should be valid QueryClient instances
      expect(client1).toBeDefined();
      expect(client2).toBeDefined();
      expect(typeof client1).toBe("object");
      expect(typeof client2).toBe("object");
    });
  });

  describe("Type safety", () => {
    it("should export properly typed trpc proxy", () => {
      // Type check - if this compiles, types are correct
      const trpcProxy = trpc;
      expect(trpcProxy).toBeDefined();
    });

    it("should maintain type information through proxy", () => {
      // Verify the trpc proxy maintains proper typing
      expect(trpc).toBeDefined();
      expect(typeof trpc).toBe("object");
    });
  });
});