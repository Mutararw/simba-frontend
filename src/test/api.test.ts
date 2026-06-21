import { describe, it, expect, vi } from "vitest";
import { api } from "../lib/api";
import { API_URL } from "../lib/config";
import { fetchProduct, PRODUCTS } from "../lib/products";

describe("API Client", () => {
  it("should have the correct base URL", () => {
    expect(api.defaults.baseURL).toBe(API_URL);
  });

  it("should have withCredentials enabled", () => {
    expect(api.defaults.withCredentials).toBe(true);
  });

  it("falls back to bundled product data when a product response is invalid", async () => {
    const fallbackProduct = PRODUCTS[0];
    const get = vi.spyOn(api, "get").mockResolvedValueOnce({ data: "<!doctype html>" });
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(fetchProduct(fallbackProduct.id)).resolves.toEqual(fallbackProduct);
    expect(get).toHaveBeenCalledWith(`/api/products/${fallbackProduct.id}`);

    get.mockRestore();
    consoleError.mockRestore();
  });
});
