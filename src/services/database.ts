import { supabase, isSupabaseConfigured } from '../supabase';
import { CartItem } from '../types';

export interface OrderRecord {
  id: string;
  created_at: string;
  customer_email?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
  status: 'confirmed' | 'processing' | 'shipped';
}

export interface CartSessionRecord {
  id: string;
  session_id: string;
  customer_email?: string;
  items: CartItem[];
  total: number;
  is_ordered: boolean;
  updated_at: string;
  created_at: string;
}

// Generate or retrieve a persistent anonymous session ID for tracking carts
export function getCartSessionId(): string {
  let sessionId = localStorage.getItem('deerhorn_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem('deerhorn_session_id', sessionId);
  }
  return sessionId;
}

// Local mock storage fallback so the dashboard works even before database tables are created
const LOCAL_ORDERS_KEY = 'deerhorn_db_orders';
const LOCAL_CARTS_KEY = 'deerhorn_db_carts';

function getLocalOrders(): OrderRecord[] {
  try {
    const saved = localStorage.getItem(LOCAL_ORDERS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveLocalOrder(order: OrderRecord) {
  try {
    const orders = getLocalOrders();
    orders.unshift(order);
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.warn(e);
  }
}

function getLocalCartSessions(): CartSessionRecord[] {
  try {
    const saved = localStorage.getItem(LOCAL_CARTS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveLocalCartSession(session: CartSessionRecord) {
  try {
    const sessions = getLocalCartSessions().filter(s => s.session_id !== session.session_id);
    sessions.unshift(session);
    localStorage.setItem(LOCAL_CARTS_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.warn(e);
  }
}

/**
 * Sync cart session to database to track abandoned carts
 */
export async function syncCartSession(items: CartItem[], total: number, email?: string): Promise<void> {
  const sessionId = getCartSessionId();
  const sessionRecord: CartSessionRecord = {
    id: sessionId,
    session_id: sessionId,
    customer_email: email,
    items,
    total,
    is_ordered: false,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  };

  // Always save locally for instant dashboard preview
  saveLocalCartSession(sessionRecord);

  if (!isSupabaseConfigured || !supabase) return;

  try {
    await supabase.from('cart_sessions').upsert({
      session_id: sessionId,
      customer_email: email || null,
      items: items,
      total: total,
      is_ordered: false,
      updated_at: new Date().toISOString()
    }, { onConflict: 'session_id' });
  } catch (err) {
    // If the table doesn't exist yet, local tracking still works
    console.debug('Cart session cloud sync notification:', err);
  }
}

/**
 * Record a completed order
 */
export async function createOrder(orderData: Omit<OrderRecord, 'id' | 'created_at'>): Promise<string> {
  const orderId = 'DH-' + Math.floor(100000 + Math.random() * 900000);
  const newOrder: OrderRecord = {
    ...orderData,
    id: orderId,
    created_at: new Date().toISOString(),
  };

  // Save to local cache
  saveLocalOrder(newOrder);

  // Mark current cart session as ordered
  const sessionId = getCartSessionId();
  const localSessions = getLocalCartSessions();
  const matched = localSessions.find(s => s.session_id === sessionId);
  if (matched) {
    matched.is_ordered = true;
    saveLocalCartSession(matched);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('orders').insert({
        id: orderId,
        customer_email: orderData.customer_email || null,
        items: orderData.items,
        subtotal: orderData.subtotal,
        discount: orderData.discount,
        tax: orderData.tax,
        total: orderData.total,
        currency: orderData.currency,
        status: orderData.status
      });

      // Update cart session in Supabase as ordered
      await supabase.from('cart_sessions').update({
        is_ordered: true,
        updated_at: new Date().toISOString()
      }).eq('session_id', sessionId);
    } catch (err) {
      console.debug('Cloud order insert notification:', err);
    }
  }

  return orderId;
}

/**
 * Fetch all orders for the admin dashboard
 */
export async function fetchAllOrders(): Promise<OrderRecord[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as OrderRecord[];
      }
    } catch (err) {
      console.debug('Fallback to local orders cache:', err);
    }
  }
  return getLocalOrders();
}

/**
 * Fetch all cart sessions for the admin dashboard (identifying abandoned carts)
 */
export async function fetchCartSessions(): Promise<CartSessionRecord[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('cart_sessions')
        .select('*')
        .order('updated_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as CartSessionRecord[];
      }
    } catch (err) {
      console.debug('Fallback to local cart sessions:', err);
    }
  }
  return getLocalCartSessions();
}
