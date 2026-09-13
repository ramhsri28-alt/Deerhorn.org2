export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  discountPercent?: number;
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  rate: number;
  label: string;
}

export interface CatalogProduct {
  id: string;
  cat: string;
  name: string;
  tag: string;
  subtag: string;
  rating: string;
  specNode: string;
  price: number;
  discountPercent?: number;
  originalPrice?: number;
  desc: string;
  pill1: string;
  pill2: string;
  img: string;
  inStock?: boolean;
}

export interface CartEvent {
  id: string;
  sessionId: string;
  userEmail?: string;
  action: 'added' | 'removed' | 'cleared';
  itemName: string;
  itemPrice: number;
  quantity: number;
  itemImage?: string;
  cartTotal: number;
  timestamp: string;
}

export interface AdminSession {
  token: string;
  email: string;
  id: string;
  role: string;
}
