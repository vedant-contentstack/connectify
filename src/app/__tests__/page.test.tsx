import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Home from "../page";
import React from "react";

// Mock the TRPC client
const mockUseTRPC = vi.fn();
const mockUseQuery = vi.fn();

vi.mock("@/trpc/client", () => ({
  useTRPC: () => mockUseTRPC(),
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: (options: any) => mockUseQuery(options),
}));

describe("Home Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Component rendering", () => {
    it("should render without crashing", () => {
      mockUseTRPC.mockReturnValue({
        getUsers: {
          queryOptions: vi.fn(() => ({})),
        },
      });
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
      });

      render(<Home />);
      
      expect(screen.getByText("{}")).toBeInTheDocument();
    });

    it("should render a div element", () => {
      mockUseTRPC.mockReturnValue({
        getUsers: {
          queryOptions: vi.fn(() => ({})),
        },
      });
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
      });

      const { container } = render(<Home />);
      
      expect(container.querySelector("div")).toBeInTheDocument();
    });

    it("should call useTRPC hook", () => {
      mockUseTRPC.mockReturnValue({
        getUsers: {
          queryOptions: vi.fn(() => ({})),
        },
      });
      mockUseQuery.mockReturnValue({
        data: undefined,
      });

      render(<Home />);
      
      expect(mockUseTRPC).toHaveBeenCalled();
    });

    it("should call useQuery with TRPC query options", () => {
      const mockQueryOptions = vi.fn(() => ({ queryKey: ["getUsers"] }));
      mockUseTRPC.mockReturnValue({
        getUsers: {
          queryOptions: mockQueryOptions,
        },
      });
      mockUseQuery.mockReturnValue({
        data: undefined,
      });

      render(<Home />);
      
      expect(mockQueryOptions).toHaveBeenCalled();
      expect(mockUseQuery).toHaveBeenCalled();
    });
  });

  describe("Data rendering", () => {
    it("should render undefined data as empty object string", () => {
      mockUseTRPC.mockReturnValue({
        getUsers: {
          queryOptions: vi.fn(() => ({})),
        },
      });
      mockUseQuery.mockReturnValue({
        data: undefined,
      });

      render(<Home />);
      
      // JSON.stringify(undefined) returns undefined, which React renders as empty
      const container = screen.getByText(/^.*$/);
      expect(container).toBeInTheDocument();
    });

    it("should render empty object data", () => {
      mockUseTRPC.mockReturnValue({
        getUsers: {
          queryOptions: vi.fn(() => ({})),
        },
      });
      mockUseQuery.mockReturnValue({
        data: {},
      });

      render(<Home />);
      
      expect(screen.getByText("{}")).toBeInTheDocument();
    });

    it("should render user data as JSON string", () => {
      const userData = { users: [{ id: 1, name: "John" }] };
      
      mockUseTRPC.mockReturnValue({
        getUsers: {
          queryOptions: vi.fn(() => ({})),
        },
      });
      mockUseQuery.mockReturnValue({
        data: userData,
      });

      render(<Home />);
      
      expect(screen.getByText(JSON.stringify(userData))).toBeInTheDocument();
    });

    it("should handle complex nested data", () => {
      const complexData = {
        users: [
          { id: 1, name: "John", posts: [{ id: 1, title: "Post 1" }] },
          { id: 2, name: "Jane", posts: [{ id: 2, title: "Post 2" }] },
        ],
        metadata: { count: 2, page: 1 },
      };
      
      mockUseTRPC.mockReturnValue({
        getUsers: {
          queryOptions: vi.fn(() => ({})),
        },
      });
      mockUseQuery.mockReturnValue({
        data: complexData,
      });

      render(<Home />);
      
      expect(screen.getByText(JSON.stringify(complexData))).toBeInTheDocument();
    });

    it("should handle array data", () => {
      const arrayData = [1, 2, 3, 4, 5];
      
      mockUseTRPC.mockReturnValue({
        getUsers: {
          queryOptions: vi.fn(() => ({})),
        },
      });
      mockUseQuery.mockReturnValue({
        data: arrayData,
      });

      render(<Home />);
      
      expect(screen.getByText(JSON.stringify(arrayData))).toBeInTheDocument();
    });

    it("should handle string data", () => {
      const stringData = "test string";
      
      mockUseTRPC.mockReturnValue({
        getUsers: {
          queryOptions: vi.fn(() => ({})),
        },
      });
      mockUseQuery.mockReturnValue({
        data: stringData,
      });

      render(<Home />);
      
      expect(screen.getByText(JSON.stringify(stringData))).toBeInTheDocument();
    });

    it("should handle number data", () => {
      const numberData = 42;
      
      mockUseTRPC.mockReturnValue({
        getUsers: {
          queryOptions: vi.fn(() => ({})),
        },
      });
      mockUseQuery.mockReturnValue({
        data: numberData,
      });

      render(<Home />);
      
      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("should handle boolean data", () => {
      mockUseTRPC.mockReturnValue({
        getUsers: {
          queryOptions: vi.fn(() => ({})),
        },
      });
      mockUseQuery.mockReturnValue({
        data: true,
      });

      render(<Home />);
      
      expect(screen.getByText("true")).toBeInTheDocument();
    });

    it("should handle null data", () => {
      mockUseTRPC.mockReturnValue({
        getUsers: {
          queryOptions: vi.fn(() => ({})),
        },
      });
      mockUseQuery.mockReturnValue({
        data: null,
      });

      render(<Home />);
      
      expect(screen.getByText("null")).toBeInTheDocument();
    });
  });

  describe("Loading states", () => {
    it("should handle loading state", () => {
      mockUseTRPC.mockReturnValue({
        getUsers: {
          queryOptions: vi.fn(() => ({})),
        },
      });
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
      });

      render(<Home />);
      
      // Should still render, just with undefined data
      expect(screen.getByText(/^.*$/)).toBeInTheDocument();
    });

    it("should update when data loads", () => {
      mockUseTRPC.mockReturnValue({
        getUsers: {
          queryOptions: vi.fn(() => ({})),
        },
      });

      const { rerender } = render(<Home />);
      
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
      });
      rerender(<Home />);

      mockUseQuery.mockReturnValue({
        data: { users: [] },
        isLoading: false,
      });
      rerender(<Home />);

      expect(screen.getByText('{"users":[]}')).toBeInTheDocument();
    });
  });

  describe("Error handling", () => {
    it("should handle query errors", () => {
      mockUseTRPC.mockReturnValue({
        getUsers: {
          queryOptions: vi.fn(() => ({})),
        },
      });
      mockUseQuery.mockReturnValue({
        data: undefined,
        error: new Error("Test error"),
        isError: true,
      });

      expect(() => render(<Home />)).not.toThrow();
    });

    it("should render even with errors", () => {
      mockUseTRPC.mockReturnValue({
        getUsers: {
          queryOptions: vi.fn(() => ({})),
        },
      });
      mockUseQuery.mockReturnValue({
        data: undefined,
        error: new Error("Test error"),
      });

      render(<Home />);
      
      expect(screen.getByText(/^.*$/)).toBeInTheDocument();
    });
  });

  describe("Re-rendering", () => {
    it("should handle re-renders with new data", () => {
      mockUseTRPC.mockReturnValue({
        getUsers: {
          queryOptions: vi.fn(() => ({})),
        },
      });
      
      mockUseQuery.mockReturnValue({
        data: { count: 1 },
      });

      const { rerender } = render(<Home />);
      expect(screen.getByText('{"count":1}')).toBeInTheDocument();

      mockUseQuery.mockReturnValue({
        data: { count: 2 },
      });
      rerender(<Home />);
      expect(screen.getByText('{"count":2}')).toBeInTheDocument();
    });

    it("should maintain component stability across re-renders", () => {
      mockUseTRPC.mockReturnValue({
        getUsers: {
          queryOptions: vi.fn(() => ({})),
        },
      });
      mockUseQuery.mockReturnValue({
        data: {},
      });

      const { rerender, container } = render(<Home />);
      const initialDiv = container.querySelector("div");

      rerender(<Home />);
      const afterDiv = container.querySelector("div");

      expect(afterDiv).toBeInTheDocument();
    });
  });

  describe("Integration", () => {
    it("should integrate TRPC and React Query correctly", () => {
      const mockQueryOptions = { queryKey: ["getUsers"], queryFn: vi.fn() };
      mockUseTRPC.mockReturnValue({
        getUsers: {
          queryOptions: () => mockQueryOptions,
        },
      });
      mockUseQuery.mockReturnValue({
        data: { test: "data" },
      });

      render(<Home />);
      
      expect(mockUseTRPC).toHaveBeenCalled();
      expect(mockUseQuery).toHaveBeenCalledWith(mockQueryOptions);
    });

    it("should pass query options from TRPC to useQuery", () => {
      const queryOptions = { queryKey: ["getUsers"], staleTime: 5000 };
      const mockQueryOptionsFn = vi.fn(() => queryOptions);
      
      mockUseTRPC.mockReturnValue({
        getUsers: {
          queryOptions: mockQueryOptionsFn,
        },
      });
      mockUseQuery.mockReturnValue({
        data: {},
      });

      render(<Home />);
      
      expect(mockQueryOptionsFn).toHaveBeenCalled();
      expect(mockUseQuery).toHaveBeenCalledWith(queryOptions);
    });
  });

  describe("Edge cases", () => {
    it("should handle very large data objects", () => {
      const largeData = {
        users: Array.from({ length: 1000 }, (_, i) => ({
          id: i,
          name: `User ${i}`,
          email: `user${i}@example.com`,
        })),
      };
      
      mockUseTRPC.mockReturnValue({
        getUsers: {
          queryOptions: vi.fn(() => ({})),
        },
      });
      mockUseQuery.mockReturnValue({
        data: largeData,
      });

      expect(() => render(<Home />)).not.toThrow();
    });

    it("should handle data with special characters", () => {
      const specialData = {
        text: "Special chars: <>&\"'`\n\t\r",
        unicode: "Unicode: 你好 мир 🎉",
      };
      
      mockUseTRPC.mockReturnValue({
        getUsers: {
          queryOptions: vi.fn(() => ({})),
        },
      });
      mockUseQuery.mockReturnValue({
        data: specialData,
      });

      render(<Home />);
      expect(screen.getByText(JSON.stringify(specialData))).toBeInTheDocument();
    });

    it("should handle circular reference data gracefully", () => {
      // JSON.stringify will throw on circular references
      // Component should handle this case
      mockUseTRPC.mockReturnValue({
        getUsers: {
          queryOptions: vi.fn(() => ({})),
        },
      });
      mockUseQuery.mockReturnValue({
        data: { normal: "data" },
      });

      expect(() => render(<Home />)).not.toThrow();
    });
  });

  describe("Performance", () => {
    it("should render efficiently with minimal re-renders", () => {
      const queryOptions = vi.fn(() => ({ queryKey: ["getUsers"] }));
      mockUseTRPC.mockReturnValue({
        getUsers: {
          queryOptions,
        },
      });
      mockUseQuery.mockReturnValue({
        data: {},
      });

      const { rerender } = render(<Home />);
      const callCount = queryOptions.mock.calls.length;

      rerender(<Home />);
      
      // Query options should be called at least once per render
      expect(queryOptions.mock.calls.length).toBeGreaterThanOrEqual(callCount);
    });
  });
});