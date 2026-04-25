import { describe, it, expect } from "vitest";
import { api } from "../lib/api";

describe("API Client", () => {
  it("should have the correct base URL", () => {
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    expect(api.defaults.baseURL).toBe(baseURL);
  });

  it("should have withCredentials enabled", () => {
    expect(api.defaults.withCredentials).toBe(true);
  });
});
