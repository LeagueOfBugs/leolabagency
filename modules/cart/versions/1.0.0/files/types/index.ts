// ============================================================
// Cart module — shared types
// Money is always stored as integer cents. Never use floats.
// ============================================================

export interface Product {
  id: string;
  name: string;
  /** Price in cents (e.g. 1999 = $19.99) */
  price_cents: number;
  slug: string;
  /** null = unlimited inventory */
  inventory: number | null;
  active: boolean;
  metadata: Record<string, unknown>;
}

export interface CartItem {
  productId: string;
  productName: string;
  /** Unit price in cents at time of add-to-cart */
  price_cents: number;
  quantity: number;
  slug: string;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address?: ShippingAddress;
  /** Total in cents */
  total_cents: number;
  payment_provider: string;
  payment_intent_id?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  /** Unit price in cents — snapshotted at order time */
  unit_price_cents: number;
  /** Product name — snapshotted at order time */
  product_name: string;
}

export interface CheckoutFormData {
  name: string;
  email: string;
  phone?: string;
  address?: ShippingAddress;
}

export interface CreateOrderPayload {
  items: CartItem[];
  customer: CheckoutFormData;
  /** Total in cents — validated server-side */
  total_cents: number;
}

export interface CreateOrderResponse {
  orderId: string;
  status: OrderStatus;
  paymentIntentId?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}
