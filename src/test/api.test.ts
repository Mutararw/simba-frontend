import { describe, it, expect } from "vitest";
import { api } from "../lib/api";
import { API_URL } from "../lib/config";

describe("API Client", () => {
  it("should have the correct base URL", () => {
    expect(api.defaults.baseURL).toBe(API_URL);
  });

  it("should have withCredentials enabled", () => {
    expect(api.defaults.withCredentials).toBe(true);
  });
});
