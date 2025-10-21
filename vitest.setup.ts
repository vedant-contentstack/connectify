import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
  useSearchParams: vi.fn(),
}));

// Mock next/font/google
vi.mock("next/font/google", () => ({
  Geist: vi.fn(() => ({ variable: "geist-sans" })),
  Geist_Mono: vi.fn(() => ({ variable: "geist-mono" })),
}));