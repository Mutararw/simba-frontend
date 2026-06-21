import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi, afterEach } from "vitest";
import ProductPage from "@/pages/ProductPage";
import { Header } from "@/components/layout/Header";
import { api } from "@/lib/api";
import { PRODUCTS } from "@/lib/products";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";

describe("product route rendering", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    useCart.setState({ items: [], savedItems: [] });
    useWishlist.setState({ items: [] });
  });

  it("renders a product page instead of crashing when saved cart and wishlist data are malformed", async () => {
    const product = PRODUCTS[0];
    vi.spyOn(api, "get").mockRejectedValueOnce(new Error("API unavailable"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    useCart.setState({ items: null, savedItems: null } as never);
    useWishlist.setState({ items: null } as never);

    render(
      <MemoryRouter initialEntries={[`/product/${product.id}`]}>
        <Routes>
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByRole("heading", { name: product.name })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });

  it("renders the header cart button when saved cart data are malformed", () => {
    useCart.setState({ items: null, savedItems: null } as never);

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: /cart/i })).toBeInTheDocument();
  });
});
