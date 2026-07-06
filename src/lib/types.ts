export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  subcategoryId: number;
  inStock: boolean;
  stock?: number;
  rating?: number;
  image: string;
  unit: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export interface Branch {
  id: string;
  name: string;
  area: string;
  rating: number;
  reviews: number;
  hours: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  role?: "customer" | "manager" | "admin" | "accountant";
  accountType?: string;
  adminRole?: string;
  branchId?: string;
  isApproved?: boolean;
}