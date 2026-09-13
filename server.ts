import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// ==========================================
// SECURE SERVER-SIDE ADMIN CREDENTIALS
// Note: These remain strictly on the backend and are NEVER bundled into client JS
// ==========================================
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'deerhorn.admin@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'DeerhornMasterKey#2026';
const ADMIN_ID = process.env.ADMIN_ID || 'DH-ROOT-001';

// In-memory valid admin tokens
const validAdminTokens = new Set<string>();

// Middleware to verify admin token
function requireAdmin(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
  }
  const token = authHeader.substring(7);
  if (!validAdminTokens.has(token)) {
    return res.status(403).json({ error: 'Forbidden: Invalid or expired admin session' });
  }
  next();
}

// ==========================================
// IN-MEMORY DATA STORES (Dynamic Backend State)
// ==========================================

export interface BackendProduct {
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

let products: BackendProduct[] = [
  {
    id: "p1",
    cat: "phones",
    name: "DEERHORN Phone Alpha",
    tag: "FLAGSHIP 01",
    subtag: "Aero-Titanium",
    rating: "4.9 (128)",
    specNode: "Cellular Node // MK IX",
    price: 849.99,
    discountPercent: 10,
    originalPrice: 949.99,
    desc: "Milled seamless titanium chassis with integrated photonic waveguide display & holographic OS projection.",
    pill1: "240W Hyper-Induction",
    pill2: "120Hz Holographic",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDogaMrhUOOJrmyIZNrXj8ofloAfHRcfGO2ABRHrblO0HG6jQnkNBdkmSq66D8AvQIqByv7L0AdMH_COY10nYpevPFT7JqfpBn4HL1joMzNLDDaJfGoF8Ot6E4sVj2ZPTIaR_ppKV1ZyYaxfxBeGdOnpV7OcwCfyzc44u9bsPjyucjturZ6_FO6C18R3WT4VqnvZTPRjlR2okEpCgNI_Dl_XNt4VFUlYWgqMuS4VUf37NUCPuLqL2DS",
    inStock: true
  },
  {
    id: "p2",
    cat: "audio",
    name: "AURORA Studio Wireless",
    tag: "ACOUSTIC MATRIX",
    subtag: "50mm Planar Driver",
    rating: "4.8 (94)",
    specNode: "Aural Immersion // Gen 3",
    price: 349.99,
    discountPercent: 15,
    originalPrice: 410.00,
    desc: "Closed-back planar magnetic monitors with laser-calibrated active noise cancellation and refined acoustic resonance.",
    pill1: "96kHz / 32-Bit DAC",
    pill2: "72 Hr Battery",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIrfroAWl-xaqkgFnqiGFdahjqSRPg6mnsJNYnSCzWHnC0YbXKhwA0s-LQWp_Zbo0kyCdIeKcHwuHw2cT2ZU8JfSqMJdkCO4Zm2SDXax3dKBrUq61G9-eKymtLLzBejsNGxkmyHJ5Ngs47nJcD744yexR0TV_p1hMP7oBlQpZoXaP2cMK-J7QY1anW5QqjltuW7SdpmwWa1iP6cQB5qN49f0oS4dVxup9M2Qvbt5c2Gcs-qJPFP-7_",
    inStock: true
  },
  {
    id: "p3",
    cat: "power",
    name: "MAG-VORTEX Flux Pad",
    tag: "FLUX INDUCTION",
    subtag: "Dual Coil Levitation",
    rating: "4.7 (210)",
    specNode: "Power Transfer // Hexagon",
    price: 89.99,
    discountPercent: 0,
    originalPrice: 89.99,
    desc: "Cybernetic faceted wireless launchpad with synchronized warm perimeter ring and ceramic magnetic tethering.",
    pill1: "65W Superflux",
    pill2: "Active Cooling Core",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGvhAQL71FaFD0NW_Ja40zL_ddebgXLpIqxCG791VoSTJYnJRjXcouV7PahU_h7FSr9bRayZjm_2AsbVQ8w50tm1YBzlTWwGNk1wPvHGBGrvaeDoZr4GhuG5kgeOll1nRLwBXqf9dkvQUWuNRwyB3tXwPqsReNOv8h_2_exAZBzm9X35PdUiHht5SrfR09tD37GMjEHzbUVVlXbFxmZaYecdcYeyx2Oa-m7eGR7vUFJTSzKPxgbdaJ",
    inStock: true
  },
  {
    id: "p4",
    cat: "audio",
    name: "CYBER-PODS Ultra ANC",
    tag: "OPERATIVE GEAR",
    subtag: "Sub-Millimeter ANC",
    rating: "4.9 (340)",
    specNode: "Personal Audio // Armor Grade",
    price: 189.99,
    discountPercent: 5,
    originalPrice: 199.99,
    desc: "Reinforced exo-skeleton micro buds, dynamic atmospheric pressure vent, and luminous charge dock readout.",
    pill1: "Low-Latency 18ms",
    pill2: "IP68 Ruggedized",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAVwl50YxOlQV-gLftxP5syzarG8xJKrMts82kfyW0iMrObBODZnJ6wEY8JuSsNzJ49ytEOekW1XKEQLXSk--wdFLyAdpW6xj8o7xQksvUkAvlOBERModhbPYNZEhAvdCCIWSXrARvLwmnzpLImR0d12gPsP4qZyHX3Nh5CcM0b43pcBetdw45jk_ZeGey1D80K_1HRaRbNywmfV7kAL4zVxulQo41b_FxJKQvgy6sV5ui_5a5-308",
    inStock: true
  },
  {
    id: "p5",
    cat: "phones",
    name: "DEERHORN Phone Apex",
    tag: "APEX COLLECTOR",
    subtag: "1TB Cryo-Flash",
    rating: "5.0 (62)",
    specNode: "Cellular Node // Limited Run",
    price: 899.00,
    discountPercent: 0,
    originalPrice: 899.00,
    desc: "Dark obsidian electroplate casing with unlocked neuro-silicon frequency and dual spectrum emitter.",
    pill1: "Quantum Shield Armor",
    pill2: "1000 Nits Edge",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDogaMrhUOOJrmyIZNrXj8ofloAfHRcfGO2ABRHrblO0HG6jQnkNBdkmSq66D8AvQIqByv7L0AdMH_COY10nYpevPFT7JqfpBn4HL1joMzNLDDaJfGoF8Ot6E4sVj2ZPTIaR_ppKV1ZyYaxfxBeGdOnpV7OcwCfyzc44u9bsPjyucjturZ6_FO6C18R3WT4VqnvZTPRjlR2okEpCgNI_Dl_XNt4VFUlYWgqMuS4VUf37NUCPuLqL2DS",
    inStock: true
  },
  {
    id: "p6",
    cat: "power",
    name: "NEO-DOCK Wireless Station",
    tag: "DESK TERMINAL",
    subtag: "3-Node Transfer",
    rating: "4.6 (85)",
    specNode: "Energy Conduit // Multi-Core",
    price: 129.99,
    discountPercent: 12,
    originalPrice: 149.99,
    desc: "Charges phone, watch, and pods concurrently with thermal exhaust channels and ambient base luminescence.",
    pill1: "Triple Simultaneous",
    pill2: "OLED Wattage HUD",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGvhAQL71FaFD0NW_Ja40zL_ddebgXLpIqxCG791VoSTJYnJRjXcouV7PahU_h7FSr9bRayZjm_2AsbVQ8w50tm1YBzlTWwGNk1wPvHGBGrvaeDoZr4GhuG5kgeOll1nRLwBXqf9dkvQUWuNRwyB3tXwPqsReNOv8h_2_exAZBzm9X35PdUiHht5SrfR09tD37GMjEHzbUVVlXbFxmZaYecdcYeyx2Oa-m7eGR7vUFJTSzKPxgbdaJ",
    inStock: true
  }
];

// Live cart events feed (stores every time an item is added to cart by shoppers)
export interface BackendCartEvent {
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

let cartEvents: BackendCartEvent[] = [];

// Tracked active cart sessions
let cartSessions: Record<string, {
  sessionId: string;
  userEmail?: string;
  items: any[];
  total: number;
  isOrdered: boolean;
  lastUpdated: string;
}> = {};

// Orders store
let orders: any[] = [];

// ==========================================
// API ENDPOINTS
// ==========================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 1. ADMIN AUTHENTICATION
app.post('/api/admin/login', (req, res) => {
  const { email, password, adminId } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const isEmailMatch = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const isPasswordMatch = password === ADMIN_PASSWORD;
  const isIdMatch = !adminId || adminId.trim().toUpperCase() === ADMIN_ID.toUpperCase();

  if (isEmailMatch && isPasswordMatch && isIdMatch) {
    const token = 'dh_adm_' + crypto.randomBytes(24).toString('hex');
    validAdminTokens.add(token);

    return res.json({
      success: true,
      token,
      admin: {
        email: ADMIN_EMAIL,
        id: ADMIN_ID,
        role: 'SUPER_ADMIN',
        loginTime: new Date().toISOString()
      }
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Access Denied: Invalid administrator credentials or security key.'
  });
});

app.get('/api/admin/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (validAdminTokens.has(token)) {
      return res.json({ valid: true, adminEmail: ADMIN_EMAIL, adminId: ADMIN_ID });
    }
  }
  return res.status(401).json({ valid: false });
});

app.post('/api/admin/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    validAdminTokens.delete(token);
  }
  res.json({ success: true });
});

// 2. LIVE CART ADDITIONS FEED
// Shoppers hit this whenever they add an item to their cart
app.post('/api/cart/event', (req, res) => {
  const { sessionId, userEmail, action, item, currentCart, cartTotal } = req.body;

  const event: BackendCartEvent = {
    id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    sessionId: sessionId || 'anon_' + Date.now(),
    userEmail: userEmail || undefined,
    action: action || 'added',
    itemName: item?.name || 'Hardware Component',
    itemPrice: item?.price || 0,
    quantity: item?.quantity || 1,
    itemImage: item?.image,
    cartTotal: cartTotal || 0,
    timestamp: new Date().toISOString()
  };

  // Add to events feed (keep last 100)
  cartEvents.unshift(event);
  if (cartEvents.length > 100) cartEvents.pop();

  // Update session state
  if (sessionId) {
    cartSessions[sessionId] = {
      sessionId,
      userEmail,
      items: currentCart || [],
      total: cartTotal || 0,
      isOrdered: false,
      lastUpdated: new Date().toISOString()
    };
  }

  res.json({ success: true, eventId: event.id });
});

// Admin views live cart additions
app.get('/api/cart/events', requireAdmin, (req, res) => {
  res.json({ events: cartEvents });
});

// Admin views cart sessions (active & abandoned)
app.get('/api/cart/sessions', requireAdmin, (req, res) => {
  res.json({ sessions: Object.values(cartSessions) });
});

// 3. PRODUCTS & FEATURES CATALOG API
// Public: Shoppers fetch the dynamic product catalog
app.get('/api/products', (req, res) => {
  res.json({ products });
});

// Admin: Add a new product or feature
app.post('/api/products', requireAdmin, (req, res) => {
  const data = req.body;

  if (!data.name || data.price === undefined) {
    return res.status(400).json({ error: 'Product name and price are required' });
  }

  const newProduct: BackendProduct = {
    id: 'p_' + Date.now(),
    cat: data.cat || 'hardware',
    name: data.name,
    tag: data.tag || 'NEW SPEC',
    subtag: data.subtag || 'Laboratory Release',
    rating: data.rating || '5.0 (New)',
    specNode: data.specNode || 'Module // Custom Specification',
    price: Number(data.price),
    discountPercent: Number(data.discountPercent) || 0,
    originalPrice: data.discountPercent && data.discountPercent > 0 
      ? Number((Number(data.price) / (1 - Number(data.discountPercent) / 100)).toFixed(2))
      : Number(data.price),
    desc: data.desc || 'Engineered with aerospace-grade precision and calibrated laboratory acoustics.',
    pill1: data.pill1 || 'High-Efficiency Node',
    pill2: data.pill2 || 'Calibrated Tuning',
    img: data.img || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDogaMrhUOOJrmyIZNrXj8ofloAfHRcfGO2ABRHrblO0HG6jQnkNBdkmSq66D8AvQIqByv7L0AdMH_COY10nYpevPFT7JqfpBn4HL1joMzNLDDaJfGoF8Ot6E4sVj2ZPTIaR_ppKV1ZyYaxfxBeGdOnpV7OcwCfyzc44u9bsPjyucjturZ6_FO6C18R3WT4VqnvZTPRjlR2okEpCgNI_Dl_XNt4VFUlYWgqMuS4VUf37NUCPuLqL2DS',
    inStock: data.inStock !== false
  };

  products.unshift(newProduct);
  res.status(201).json({ success: true, product: newProduct });
});

// Admin: Edit an existing product or feature
app.put('/api/products/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const existing = products[index];
  const updatedPrice = updates.price !== undefined ? Number(updates.price) : existing.price;
  const updatedDiscount = updates.discountPercent !== undefined ? Number(updates.discountPercent) : (existing.discountPercent || 0);

  const updatedProduct: BackendProduct = {
    ...existing,
    ...updates,
    price: updatedPrice,
    discountPercent: updatedDiscount,
    originalPrice: updatedDiscount > 0
      ? Number((updatedPrice / (1 - updatedDiscount / 100)).toFixed(2))
      : updatedPrice
  };

  products[index] = updatedProduct;
  res.json({ success: true, product: updatedProduct });
});

// Admin: Delete product
app.delete('/api/products/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  products = products.filter(p => p.id !== id);
  res.json({ success: true, message: 'Product removed' });
});

// 4. ORDERS API
app.get('/api/orders', requireAdmin, (req, res) => {
  res.json({ orders });
});

app.post('/api/orders', (req, res) => {
  const orderData = req.body;
  const orderId = 'DH-' + Math.floor(100000 + Math.random() * 900000);
  const newOrder = {
    ...orderData,
    id: orderId,
    createdAt: new Date().toISOString(),
    status: 'confirmed'
  };
  orders.unshift(newOrder);

  // Mark session as purchased
  if (orderData.sessionId && cartSessions[orderData.sessionId]) {
    cartSessions[orderData.sessionId].isOrdered = true;
  }

  res.status(201).json({ success: true, orderId });
});

// ==========================================
// VITE MIDDLEWARE SETUP
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DEERHORN Backend Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
