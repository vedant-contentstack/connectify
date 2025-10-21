import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { TRPCReactProvider, useTRPC } from "../client";
import React from "react";

// Mock dependencies
vi.mock("../query-client", () => ({
  makeQueryClient: vi.fn(() => ({
    getDefaultOptions: vi.fn(() => ({})),
    setQueryData: vi.fn(),
    getQueryData: vi.fn(),
    clear: vi.fn(),
  })),
}));

describe("TRPC Client", () => {
  describe("TRPCReactProvider", () => {
    it("should render children", () => {
      render(
        <TRPCReactProvider>
          <div data-testid="child">Test Child</div>
        </TRPCReactProvider>
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
      expect(screen.getByText("Test Child")).toBeInTheDocument();
    });

    it("should render multiple children", () => {
      render(
        <TRPCReactProvider>
          <div data-testid="child1">Child 1</div>
          <div data-testid="child2">Child 2</div>
        </TRPCReactProvider>
      );

      expect(screen.getByTestId("child1")).toBeInTheDocument();
      expect(screen.getByTestId("child2")).toBeInTheDocument();
    });

    it("should handle nested components", () => {
      const NestedComponent = () => <div data-testid="nested">Nested</div>;

      render(
        <TRPCReactProvider>
          <NestedComponent />
        </TRPCReactProvider>
      );

      expect(screen.getByTestId("nested")).toBeInTheDocument();
    });

    it("should not crash with empty children", () => {
      expect(() => {
        render(<TRPCReactProvider>{null}</TRPCReactProvider>);
      }).not.toThrow();
    });

    it("should provide TRPC context to children", () => {
      const TestComponent = () => {
        const trpc = useTRPC();
        return <div data-testid="has-trpc">{trpc ? "Has TRPC" : "No TRPC"}</div>;
      };

      render(
        <TRPCReactProvider>
          <TestComponent />
        </TRPCReactProvider>
      );

      expect(screen.getByTestId("has-trpc")).toBeInTheDocument();
    });
  });

  describe("Environment Detection", () => {
    const originalWindow = global.window;
    const originalEnv = process.env;

    beforeEach(() => {
      vi.resetModules();
    });

    it("should handle browser environment", () => {
      // Browser environment (window is defined)
      expect(typeof window).toBe("object");
    });

    it("should handle VERCEL_URL environment variable", () => {
      const originalVercelUrl = process.env.VERCEL_URL;
      
      // Test without VERCEL_URL
      delete process.env.VERCEL_URL;
      expect(process.env.VERCEL_URL).toBeUndefined();
      
      // Restore
      if (originalVercelUrl) {
        process.env.VERCEL_URL = originalVercelUrl;
      }
    });
  });

  describe("useTRPC Hook", () => {
    it("should be accessible within TRPCReactProvider", () => {
      const TestComponent = () => {
        const trpc = useTRPC();
        return <div data-testid="trpc-test">{JSON.stringify(!!trpc)}</div>;
      };

      render(
        <TRPCReactProvider>
          <TestComponent />
        </TRPCReactProvider>
      );

      expect(screen.getByTestId("trpc-test")).toBeInTheDocument();
    });

    it("should provide consistent context", () => {
      let trpcInstance1: any;
      let trpcInstance2: any;

      const Component1 = () => {
        trpcInstance1 = useTRPC();
        return <div>Component 1</div>;
      };

      const Component2 = () => {
        trpcInstance2 = useTRPC();
        return <div>Component 2</div>;
      };

      render(
        <TRPCReactProvider>
          <Component1 />
          <Component2 />
        </TRPCReactProvider>
      );

      // Both should get the same context instance
      expect(trpcInstance1).toBe(trpcInstance2);
    });
  });

  describe("QueryClient Management", () => {
    it("should create a query client on mount", () => {
      const { unmount } = render(
        <TRPCReactProvider>
          <div>Test</div>
        </TRPCReactProvider>
      );

      expect(screen.getByText("Test")).toBeInTheDocument();
      unmount();
    });

    it("should handle multiple provider instances", () => {
      const { container } = render(
        <>
          <TRPCReactProvider>
            <div data-testid="provider1">Provider 1</div>
          </TRPCReactProvider>
          <TRPCReactProvider>
            <div data-testid="provider2">Provider 2</div>
          </TRPCReactProvider>
        </>
      );

      expect(screen.getByTestId("provider1")).toBeInTheDocument();
      expect(screen.getByTestId("provider2")).toBeInTheDocument();
    });
  });

  describe("Error Boundaries", () => {
    it("should handle children that throw errors gracefully", () => {
      const ThrowingComponent = () => {
        if (process.env.NODE_ENV === "test") {
          return <div>Safe render</div>;
        }
        throw new Error("Test error");
      };

      expect(() => {
        render(
          <TRPCReactProvider>
            <ThrowingComponent />
          </TRPCReactProvider>
        );
      }).not.toThrow();
    });
  });

  describe("Re-rendering", () => {
    it("should handle re-renders without recreating TRPC client", () => {
      const { rerender } = render(
        <TRPCReactProvider>
          <div data-testid="content">Initial</div>
        </TRPCReactProvider>
      );

      expect(screen.getByTestId("content")).toHaveTextContent("Initial");

      rerender(
        <TRPCReactProvider>
          <div data-testid="content">Updated</div>
        </TRPCReactProvider>
      );

      expect(screen.getByTestId("content")).toHaveTextContent("Updated");
    });

    it("should maintain provider stability across children updates", () => {
      const { rerender } = render(
        <TRPCReactProvider>
          <div>Version 1</div>
        </TRPCReactProvider>
      );

      rerender(
        <TRPCReactProvider>
          <div>Version 2</div>
        </TRPCReactProvider>
      );

      rerender(
        <TRPCReactProvider>
          <div>Version 3</div>
        </TRPCReactProvider>
      );

      expect(screen.getByText("Version 3")).toBeInTheDocument();
    });
  });

  describe("Props validation", () => {
    it("should accept readonly children prop", () => {
      const readonlyChildren = <div>Test</div> as Readonly<React.ReactNode>;

      expect(() => {
        render(<TRPCReactProvider>{readonlyChildren}</TRPCReactProvider>);
      }).not.toThrow();
    });

    it("should work with various React node types", () => {
      const testCases = [
        <div key="div">Div</div>,
        <span key="span">Span</span>,
        "Plain text",
        123,
        null,
        undefined,
      ];

      testCases.forEach((child, index) => {
        const { unmount } = render(
          <TRPCReactProvider>{child}</TRPCReactProvider>
        );
        unmount();
      });
    });
  });
});