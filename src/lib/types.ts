export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  subcategoryId: number;
  inStock: boolean;
  image: string;
  unit: string;
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
  accountType?: string;
  adminRole?: string;
}