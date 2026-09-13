import { CatalogProduct, CartEvent, AdminSession } from '../types';
import { CATALOG_ITEMS } from '../data';

const ADMIN_TOKEN_KEY = 'deerhorn_admin_token';
const ADMIN_DATA_KEY = 'deerhorn_admin_data';
const STORAGE_PRODUCTS_KEY = 'deerhorn_dynamic_products';
const STORAGE_EVENTS_KEY = 'deerhorn_cart_events';

// Static / Fallback Admin Credentials (used if running on static hosts like Netlify without Express server)
const FALLBACK_ADMIN = {
  email: 'deerhorn.admin@gmail.com',
  password: 'DeerhornMasterKey#2026',
  adminId: 'DH-ROOT-001'
};

// ==========================================
// ADMIN AUTHENTICATION
// ==========================================

export async function loginAdmin(email: string, password: string, adminId?: string): Promise<{ success: boolean; admin?: any; error?: string }> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, adminId }),
    });

    const contentType = res.headers.get('content-type');
    if (res.ok && contentType && contentType.includes('application/json')) {
      const data = await res.json();
      if (data.success) {
        localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
        localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(data.admin));
        return { success: true, admin: data.admin };
      }
      return { success: false, error: data.error || 'Authentication denied' };
    }
  } catch (err) {
    console.debug('Backend server check failed, testing static verification:', err);
  }

  // Fallback for Netlify / Static hosting where backend server is not running
  const isEmailMatch = email.trim().toLowerCase() === FALLBACK_ADMIN.email.toLowerCase();
  const isPasswordMatch = password === FALLBACK_ADMIN.password;
  const isIdMatch = !adminId || adminId.trim().toUpperCase() === FALLBACK_ADMIN.adminId.toUpperCase();

  if (isEmailMatch && isPasswordMatch && isIdMatch) {
    const staticToken = 'dh_adm_static_' + Date.now();
    const admin = {
      email: FALLBACK_ADMIN.email,
      id: FALLBACK_ADMIN.adminId,
      role: 'SUPER_ADMIN',
      loginTime: new Date().toISOString()
    };
    localStorage.setItem(ADMIN_TOKEN_KEY, staticToken);
    localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(admin));
    return { success: true, admin };
  }

  return { success: false, error: 'Access Denied: Invalid operative email, admin ID, or master password.' };
}

export function getStoredAdminSession(): AdminSession | null {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  const data = localStorage.getItem(ADMIN_DATA_KEY);
  if (token && data) {
    try {
      const parsed = JSON.parse(data);
      return { token, ...parsed };
    } catch {
      return null;
    }
  }
  return null;
}

export async function logoutAdmin(): Promise<void> {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (token) {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      console.warn('Logout notification:', e);
    }
  }
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_DATA_KEY);
}

function getAdminAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

// ==========================================
// LIVE CART ACTIVITY DISPATCH
// ==========================================

export async function sendCartEvent(params: {
  sessionId: string;
  userEmail?: string;
  action: 'added' | 'removed' | 'cleared';
  item: { id: string; name: string; price: number; quantity: number; image?: string; category?: string };
  currentCart: any[];
  cartTotal: number;
}): Promise<void> {
  const newEvent: CartEvent = {
    id: 'evt-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    sessionId: params.sessionId,
    userEmail: params.userEmail,
    action: params.action,
    itemName: params.item.name,
    itemPrice: params.item.price,
    quantity: params.item.quantity || 1,
    itemImage: params.item.image,
    cartTotal: params.cartTotal,
    timestamp: new Date().toISOString()
  };

  // Local storage backup for static Netlify hosting
  try {
    const raw = localStorage.getItem(STORAGE_EVENTS_KEY);
    const list: CartEvent[] = raw ? JSON.parse(raw) : [];
    list.unshift(newEvent);
    localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(list.slice(0, 50)));
  } catch (e) {
    console.debug('Storage sync:', e);
  }

  // Also notify server if available
  try {
    await fetch('/api/cart/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
  } catch (err) {
    console.debug('Cart event server sync fallback:', err);
  }
}

export async function fetchLiveCartEvents(): Promise<CartEvent[]> {
  try {
    const res = await fetch('/api/cart/events', {
      headers: getAdminAuthHeaders()
    });
    const contentType = res.headers.get('content-type');
    if (res.ok && contentType && contentType.includes('application/json')) {
      const data = await res.json();
      if (data.events && data.events.length > 0) {
        return data.events;
      }
    }
  } catch (err) {
    console.debug('Fetch events server fallback:', err);
  }

  // Fallback to local storage
  try {
    const raw = localStorage.getItem(STORAGE_EVENTS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}

  return [];
}

// ==========================================
// PRODUCTS & FEATURES MANAGEMENT
// ==========================================

function getLocalStoredProducts(): CatalogProduct[] {
  try {
    const saved = localStorage.getItem(STORAGE_PRODUCTS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return CATALOG_ITEMS;
}

function saveLocalStoredProducts(products: CatalogProduct[]) {
  try {
    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.warn('Storage product save error:', e);
  }
}

export async function fetchCatalogProducts(): Promise<CatalogProduct[]> {
  try {
    const res = await fetch('/api/products');
    const contentType = res.headers.get('content-type');
    if (res.ok && contentType && contentType.includes('application/json')) {
      const data = await res.json();
      if (data.products && data.products.length > 0) {
        return data.products;
      }
    }
  } catch (err) {
    console.debug('Fetch products fallback to local data:', err);
  }

  return getLocalStoredProducts();
}

export async function createCatalogProduct(productData: Partial<CatalogProduct>): Promise<{ success: boolean; product?: CatalogProduct; error?: string }> {
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(productData),
    });

    const contentType = res.headers.get('content-type');
    if (res.ok && contentType && contentType.includes('application/json')) {
      const data = await res.json();
      if (data.success) {
        return { success: true, product: data.product };
      }
    }
  } catch (err) {
    console.debug('Server create product fallback to local:', err);
  }

  // Fallback creation for static Netlify mode
  const currentList = getLocalStoredProducts();
  const newProduct: CatalogProduct = {
    id: productData.id || 'prod-' + Date.now(),
    cat: productData.cat || 'modules',
    name: productData.name || 'Unnamed Module',
    tag: productData.tag || 'NEW-RELEASE',
    subtag: productData.subtag || 'Laboratory Hardware',
    desc: productData.desc || 'Precision engineered hardware module.',
    rating: productData.rating || '4.9',
    specNode: productData.specNode || 'DH-MOD-01',
    price: Number(productData.price) || 299,
    originalPrice: productData.originalPrice ? Number(productData.originalPrice) : undefined,
    discountPercent: productData.discountPercent ? Number(productData.discountPercent) : undefined,
    pill1: productData.pill1 || 'High Precision',
    pill2: productData.pill2 || 'Calibrated',
    img: productData.img || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    inStock: productData.inStock !== false
  };

  const updated = [newProduct, ...currentList];
  saveLocalStoredProducts(updated);
  return { success: true, product: newProduct };
}

export async function updateCatalogProduct(id: string, updates: Partial<CatalogProduct>): Promise<{ success: boolean; product?: CatalogProduct; error?: string }> {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(updates),
    });

    const contentType = res.headers.get('content-type');
    if (res.ok && contentType && contentType.includes('application/json')) {
      const data = await res.json();
      if (data.success) {
        return { success: true, product: data.product };
      }
    }
  } catch (err) {
    console.debug('Server update product fallback to local:', err);
  }

  // Fallback update for static Netlify mode
  const currentList = getLocalStoredProducts();
  let updatedProduct: CatalogProduct | undefined;
  const updated = currentList.map(item => {
    if (item.id === id) {
      updatedProduct = { ...item, ...updates };
      return updatedProduct;
    }
    return item;
  });

  if (updatedProduct) {
    saveLocalStoredProducts(updated);
    return { success: true, product: updatedProduct };
  }

  return { success: false, error: 'Product not found' };
}

export async function deleteCatalogProduct(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: getAdminAuthHeaders()
    });

    const contentType = res.headers.get('content-type');
    if (res.ok && contentType && contentType.includes('application/json')) {
      const data = await res.json();
      if (data.success) {
        return { success: true };
      }
    }
  } catch (err) {
    console.debug('Server delete product fallback to local:', err);
  }

  // Fallback delete for static Netlify mode
  const currentList = getLocalStoredProducts();
  const filtered = currentList.filter(item => item.id !== id);
  saveLocalStoredProducts(filtered);
  return { success: true };
}
