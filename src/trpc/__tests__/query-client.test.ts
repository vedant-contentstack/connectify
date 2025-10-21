import { describe, it, expect, beforeEach } from "vitest";
import { makeQueryClient } from "../query-client";
import { QueryClient } from "@tanstack/react-query";

describe("Query Client Factory", () => {
  describe("makeQueryClient", () => {
    it("should create a QueryClient instance", () => {
      const client = makeQueryClient();
      
      expect(client).toBeInstanceOf(QueryClient);
    });

    it("should create unique instances on each call", () => {
      const client1 = makeQueryClient();
      const client2 = makeQueryClient();
      
      expect(client1).not.toBe(client2);
    });

    it("should configure staleTime to 30 seconds", () => {
      const client = makeQueryClient();
      const defaultOptions = client.getDefaultOptions();
      
      expect(defaultOptions.queries?.staleTime).toBe(30 * 1000);
    });

    it("should have dehydrate options configured", () => {
      const client = makeQueryClient();
      const defaultOptions = client.getDefaultOptions();
      
      expect(defaultOptions.dehydrate).toBeDefined();
      expect(defaultOptions.dehydrate?.shouldDehydrateQuery).toBeDefined();
    });

    it("should have hydrate options configured", () => {
      const client = makeQueryClient();
      const defaultOptions = client.getDefaultOptions();
      
      expect(defaultOptions.hydrate).toBeDefined();
    });

    it("should dehydrate queries with pending status", () => {
      const client = makeQueryClient();
      const defaultOptions = client.getDefaultOptions();
      
      const mockQuery = {
        state: { status: "pending" as const },
        queryKey: ["test"],
        queryHash: "test",
      } as any;
      
      const shouldDehydrate = defaultOptions.dehydrate?.shouldDehydrateQuery?.(mockQuery);
      expect(shouldDehydrate).toBe(true);
    });

    it("should handle successful query dehydration", () => {
      const client = makeQueryClient();
      const defaultOptions = client.getDefaultOptions();
      
      const mockQuery = {
        state: { 
          status: "success" as const,
          dataUpdatedAt: Date.now(),
        },
        queryKey: ["test"],
        queryHash: "test",
      } as any;
      
      const shouldDehydrate = defaultOptions.dehydrate?.shouldDehydrateQuery?.(mockQuery);
      expect(typeof shouldDehydrate).toBe("boolean");
    });

    it("should be callable multiple times without errors", () => {
      expect(() => {
        for (let i = 0; i < 10; i++) {
          makeQueryClient();
        }
      }).not.toThrow();
    });

    it("should properly initialize with all required options", () => {
      const client = makeQueryClient();
      const options = client.getDefaultOptions();
      
      expect(options).toBeDefined();
      expect(options.queries).toBeDefined();
      expect(options.dehydrate).toBeDefined();
      expect(options.hydrate).toBeDefined();
    });
  });

  describe("Query Client Configuration", () => {
    let client: QueryClient;

    beforeEach(() => {
      client = makeQueryClient();
    });

    it("should allow setting queries", () => {
      expect(() => {
        client.setQueryData(["test"], { data: "test" });
      }).not.toThrow();
    });

    it("should retrieve set query data", () => {
      const testData = { value: "test" };
      client.setQueryData(["test"], testData);
      
      const retrieved = client.getQueryData(["test"]);
      expect(retrieved).toEqual(testData);
    });

    it("should handle query invalidation", () => {
      client.setQueryData(["test"], { data: "test" });
      
      expect(() => {
        client.invalidateQueries({ queryKey: ["test"] });
      }).not.toThrow();
    });

    it("should support query cancellation", () => {
      expect(() => {
        client.cancelQueries({ queryKey: ["test"] });
      }).not.toThrow();
    });

    it("should handle clearing all queries", () => {
      client.setQueryData(["test1"], "data1");
      client.setQueryData(["test2"], "data2");
      
      client.clear();
      
      expect(client.getQueryData(["test1"])).toBeUndefined();
      expect(client.getQueryData(["test2"])).toBeUndefined();
    });
  });

  describe("Edge Cases", () => {
    it("should handle rapid client creation", () => {
      const clients = Array.from({ length: 100 }, () => makeQueryClient());
      
      expect(clients).toHaveLength(100);
      clients.forEach(client => {
        expect(client).toBeInstanceOf(QueryClient);
      });
    });

    it("should create independent clients", () => {
      const client1 = makeQueryClient();
      const client2 = makeQueryClient();
      
      client1.setQueryData(["test"], "data1");
      client2.setQueryData(["test"], "data2");
      
      expect(client1.getQueryData(["test"])).toBe("data1");
      expect(client2.getQueryData(["test"])).toBe("data2");
    });

    it("should maintain configuration across instances", () => {
      const client1 = makeQueryClient();
      const client2 = makeQueryClient();
      
      const options1 = client1.getDefaultOptions();
      const options2 = client2.getDefaultOptions();
      
      expect(options1.queries?.staleTime).toBe(options2.queries?.staleTime);
    });
  });
});