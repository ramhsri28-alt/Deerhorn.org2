import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllOrders, fetchCartSessions, OrderRecord, CartSessionRecord } from '../services/database';
import { 
  fetchLiveCartEvents, 
  fetchCatalogProducts, 
  createCatalogProduct, 
  updateCatalogProduct, 
  deleteCatalogProduct, 
  logoutAdmin 
} from '../services/api';
import { formatPrice } from '../data';
import { CatalogProduct, CartEvent, AdminSession } from '../types';

interface AdminDashboardProps {
  currency: string;
  adminSession: AdminSession | null;
  onAdminLogout: () => void;
  onCatalogUpdated?: () => void;
}

const PRESET_PHOTOS = [
  {
    name: 'Titanium Phone Node',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDogaMrhUOOJrmyIZNrXj8ofloAfHRcfGO2ABRHrblO0HG6jQnkNBdkmSq66D8AvQIqByv7L0AdMH_COY10nYpevPFT7JqfpBn4HL1joMzNLDDaJfGoF8Ot6E4sVj2ZPTIaR_ppKV1ZyYaxfxBeGdOnpV7OcwCfyzc44u9bsPjyucjturZ6_FO6C18R3WT4VqnvZTPRjlR2okEpCgNI_Dl_XNt4VFUlYWgqMuS4VUf37NUCPuLqL2DS'
  },
  {
    name: 'Planar Magnetic Studio Headset',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIrfroAWl-xaqkgFnqiGFdahjqSRPg6mnsJNYnSCzWHnC0YbXKhwA0s-LQWp_Zbo0kyCdIeKcHwuHw2cT2ZU8JfSqMJdkCO4Zm2SDXax3dKBrUq61G9-eKymtLLzBejsNGxkmyHJ5Ngs47nJcD744yexR0TV_p1hMP7oBlQpZoXaP2cMK-J7QY1anW5QqjltuW7SdpmwWa1iP6cQB5qN49f0oS4dVxup9M2Qvbt5c2Gcs-qJPFP-7_'
  },
  {
    name: 'Flux Wireless Inductive Dock',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGvhAQL71FaFD0NW_Ja40zL_ddebgXLpIqxCG791VoSTJYnJRjXcouV7PahU_h7FSr9bRayZjm_2AsbVQ8w50tm1YBzlTWwGNk1wPvHGBGrvaeDoZr4GhuG5kgeOll1nRLwBXqf9dkvQUWuNRwyB3tXwPqsReNOv8h_2_exAZBzm9X35PdUiHht5SrfR09tD37GMjEHzbUVVlXbFxmZaYecdcYeyx2Oa-m7eGR7vUFJTSzKPxgbdaJ'
  },
  {
    name: 'Armor ANC Micro Pods',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAVwl50YxOlQV-gLftxP5syzarG8xJKrMts82kfyW0iMrObBODZnJ6wEY8JuSsNzJ49ytEOekW1XKEQLXSk--wdFLyAdpW6xj8o7xQksvUkAvlOBERModhbPYNZEhAvdCCIWSXrARvLwmnzpLImR0d12gPsP4qZyHX3Nh5CcM0b43pcBetdw45jk_ZeGey1D80K_1HRaRbNywmfV7kAL4zVxulQo41b_FxJKQvgy6sV5ui_5a5-308'
  }
];

export function AdminDashboard({ currency, adminSession, onAdminLogout, onCatalogUpdated }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'cart_events' | 'products' | 'orders' | 'abandoned' | 'sql'>('cart_events');
  
  // Data states
  const [cartEvents, setCartEvents] = useState<CartEvent[]>([]);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [cartSessions, setCartSessions] = useState<CartSessionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Product Edit / Create Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Partial<CatalogProduct>>({
    name: '',
    cat: 'phones',
    price: 499.00,
    discountPercent: 0,
    desc: '',
    tag: 'NEW RELEASE',
    subtag: 'Hardware Specification',
    img: PRESET_PHOTOS[0].url,
    pill1: 'High Performance',
    pill2: 'Precision Calibrated',
    specNode: 'Custom Architecture Node'
  });
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    loadAllData();

    // Set auto-refresh interval for live cart activity feed
    const interval = setInterval(() => {
      fetchLiveCartEvents().then(events => {
        if (events && events.length > 0) setCartEvents(events);
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    const [eventsData, productsData, ordersData, cartsData] = await Promise.all([
      fetchLiveCartEvents(),
      fetchCatalogProducts(),
      fetchAllOrders(),
      fetchCartSessions(),
    ]);
    setCartEvents(eventsData);
    setProducts(productsData);
    setOrders(ordersData);
    setCartSessions(cartsData);
    setLoading(false);
  };

  // Open modal to add product
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      cat: 'phones',
      price: 299.99,
      discountPercent: 10,
      desc: 'Milled aerospace-grade chassis with precision hardware sensors and custom low-latency acoustic resonance.',
      tag: 'LABORATORY SPEC',
      subtag: 'Aero-Titanium Alloy',
      img: PRESET_PHOTOS[0].url,
      pill1: 'Fast Synchronized',
      pill2: 'Calibrated Tuning',
      specNode: 'Hardware Node // MK II'
    });
    setFormError(null);
    setIsProductModalOpen(true);
  };

  // Open modal to edit existing product
  const handleOpenEditProduct = (product: CatalogProduct) => {
    setEditingProductId(product.id);
    setProductForm({ ...product });
    setFormError(null);
    setIsProductModalOpen(true);
  };

  // Save product (Add or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSaving(true);
    setFormError(null);

    try {
      if (editingProductId) {
        // Update product
        const res = await updateCatalogProduct(editingProductId, productForm);
        if (res.success && res.product) {
          setProducts(prev => prev.map(p => p.id === editingProductId ? res.product! : p));
          setIsProductModalOpen(false);
          onCatalogUpdated?.();
        } else {
          setFormError(res.error || 'Failed to update product.');
        }
      } else {
        // Create new product
        const res = await createCatalogProduct(productForm);
        if (res.success && res.product) {
          setProducts(prev => [res.product!, ...prev]);
          setIsProductModalOpen(false);
          onCatalogUpdated?.();
        } else {
          setFormError(res.error || 'Failed to create product.');
        }
      }
    } catch (err: any) {
      setFormError(err.message || 'Error occurred while saving.');
    } finally {
      setFormSaving(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the store catalog?`)) {
      return;
    }
    const res = await deleteCatalogProduct(id);
    if (res.success) {
      setProducts(prev => prev.filter(p => p.id !== id));
      onCatalogUpdated?.();
    } else {
      alert(res.error || 'Failed to delete product.');
    }
  };

  const abandonedCarts = cartSessions.filter(c => !c.is_ordered && c.items && c.items.length > 0);
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <main className="w-full pt-20 bg-background min-h-screen text-on-surface">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin py-space-xl">
        
        {/* Admin Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-outline-variant/30">
          <div>
            <div className="flex items-center gap-2 font-label-sm text-xs uppercase tracking-widest text-primary font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span>DEERHORN Backend Operations Portal</span>
            </div>
            <h1 className="font-headline-lg text-2xl md:text-3xl font-medium tracking-tight">
              Control Matrix & Catalog Management
            </h1>
          </div>
          
          <div className="flex items-center flex-wrap gap-3">
            {adminSession && (
              <div className="flex items-center gap-2 bg-surface-container border border-outline-variant/40 px-3 py-1.5 rounded-lg text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span className="text-on-surface-variant">Admin:</span>
                <span className="text-on-surface font-semibold">{adminSession.email}</span>
                <span className="text-primary font-bold">({adminSession.id})</span>
              </div>
            )}

            <button
              onClick={loadAllData}
              className="px-3.5 py-2 rounded-lg bg-surface-container border border-outline-variant/40 hover:border-primary/50 text-xs font-label-sm uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all"
              type="button"
            >
              <span className={`material-symbols-outlined text-[16px] ${loading ? 'animate-spin' : ''}`}>sync</span>
              <span>Refresh</span>
            </button>

            <button
              onClick={async () => {
                await logoutAdmin();
                onAdminLogout();
              }}
              className="px-3 py-2 rounded-lg bg-error-container/30 border border-error/40 text-error hover:bg-error-container/60 text-xs font-label-sm uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Sign Out Admin</span>
            </button>
          </div>
        </div>

        {/* Metric Quick Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-1 shadow-sm">
            <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">Live Cart Additions</span>
            <span className="font-display-lg text-2xl font-bold text-primary font-mono">{cartEvents.length}</span>
            <span className="text-[11px] text-secondary flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[14px]">sensors</span>
              <span>Real-time add-to-cart feed</span>
            </span>
          </div>

          <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-1 shadow-sm">
            <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">Active Catalog Items</span>
            <span className="font-display-lg text-2xl font-bold text-on-surface font-mono">{products.length}</span>
            <span className="text-[11px] text-primary flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[14px]">tune</span>
              <span>Configurable in Studio</span>
            </span>
          </div>

          <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-1 shadow-sm">
            <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">Total Store Revenue</span>
            <span className="font-display-lg text-2xl font-bold text-secondary font-mono">{formatPrice(totalRevenue, currency)}</span>
            <span className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[14px]">receipt</span>
              <span>{orders.length} Dispatched orders</span>
            </span>
          </div>

          <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-1 shadow-sm">
            <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">Abandoned Carts</span>
            <span className="font-display-lg text-2xl font-bold text-error font-mono">{abandonedCarts.length}</span>
            <span className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[14px]">shopping_cart_off</span>
              <span>Pending shopper sessions</span>
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-outline-variant/30 gap-4 md:gap-6 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('cart_events')}
            className={`pb-3 font-label-md text-sm uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'cart_events'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">stream</span>
            <span>Live Cart Activity ({cartEvents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 font-label-md text-sm uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            <span>Product & Feature Studio ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 font-label-md text-sm uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('abandoned')}
            className={`pb-3 font-label-md text-sm uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'abandoned'
                ? 'border-error text-error'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">shopping_cart_off</span>
            <span>Abandoned ({abandonedCarts.length})</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: LIVE CART ACTIVITY FEED                                           */}
        {/* ========================================================================= */}
        {activeTab === 'cart_events' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                </span>
                <span className="font-label-sm text-xs uppercase font-semibold text-on-surface">Live Cart Monitor</span>
                <span className="text-xs text-on-surface-variant">— Displays every time a customer adds or changes an item in their cart</span>
              </div>
              <span className="text-xs text-secondary font-mono">Auto-Syncing</span>
            </div>

            <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
              {cartEvents.length === 0 ? (
                <div className="py-16 text-center text-on-surface-variant flex flex-col items-center gap-3">
                  <span className="material-symbols-outlined text-[40px] text-outline">shopping_bag</span>
                  <p className="text-base font-medium">No cart additions logged yet.</p>
                  <p className="text-xs text-on-surface-variant/70 max-w-sm">
                    Open the store, click "Add to Queue" on any hardware node, and the live notification will immediately register here!
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface-container border-b border-outline-variant/30 font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant">
                      <tr>
                        <th className="py-3 px-4">Event Time</th>
                        <th className="py-3 px-4">Customer / Session</th>
                        <th className="py-3 px-4">Action</th>
                        <th className="py-3 px-4">Item Added</th>
                        <th className="py-3 px-4">Item Price</th>
                        <th className="py-3 px-4">Cart Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {cartEvents.map((evt) => (
                        <tr key={evt.id} className="hover:bg-surface-container-high/40 transition-colors">
                          <td className="py-3 px-4 text-xs font-mono text-on-surface-variant">
                            {new Date(evt.timestamp).toLocaleTimeString()}
                          </td>
                          <td className="py-3 px-4 text-xs">
                            <span className="font-semibold text-on-surface">
                              {evt.userEmail || <span className="text-on-surface-variant italic">Shopper Session ({evt.sessionId.substring(0, 10)}...)</span>}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-label-sm uppercase font-semibold ${
                              evt.action === 'added' 
                                ? 'bg-primary-container text-primary border border-primary/30' 
                                : 'bg-surface-container text-on-surface-variant'
                            }`}>
                              {evt.action === 'added' ? '+ Added Item' : evt.action}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {evt.itemImage && (
                                <img src={evt.itemImage} alt="" className="w-9 h-9 rounded object-contain bg-surface-container p-0.5 border border-outline-variant/30" />
                              )}
                              <div className="flex flex-col">
                                <span className="font-medium text-on-surface text-xs">{evt.itemName}</span>
                                <span className="text-[10px] text-on-surface-variant">Quantity: {evt.quantity}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono font-medium text-xs text-on-surface">
                            {formatPrice(evt.itemPrice, currency)}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-xs text-primary">
                            {formatPrice(evt.cartTotal, currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PRODUCT & FEATURE STUDIO (Add, Edit Photo, Price, Discount, Name)  */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <div>
                <h3 className="font-headline-sm text-lg font-medium text-on-surface">Hardware Catalog & Feature Manager</h3>
                <p className="text-xs text-on-surface-variant">
                  Add new hardware releases, modify pricing, apply discounts, update specifications, and change laboratory photos.
                </p>
              </div>
              <button
                onClick={handleOpenAddProduct}
                className="px-4 py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-xs uppercase tracking-wider font-bold hover:bg-primary-fixed-dim transition-all flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Add New Product / Feature</span>
              </button>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="rounded-xl bg-surface-container-low border border-outline-variant/30 p-5 flex flex-col justify-between gap-4 shadow-sm hover:border-primary/40 transition-all">
                  
                  <div>
                    {/* Image preview & badge */}
                    <div className="relative w-full h-44 rounded-lg bg-surface-container overflow-hidden mb-3 border border-outline-variant/20 flex items-center justify-center p-2">
                      <img src={p.img} alt={p.name} className="w-full h-full object-contain filter drop-shadow-md" />
                      
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <span className="px-2 py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur-md text-[10px] font-label-sm uppercase font-semibold text-primary border border-outline-variant/30">
                          {p.tag || p.cat}
                        </span>
                        {p.discountPercent && p.discountPercent > 0 && (
                          <span className="px-2 py-0.5 rounded bg-error/90 text-on-error text-[10px] font-label-sm uppercase font-bold">
                            {p.discountPercent}% OFF
                          </span>
                        )}
                      </div>

                      <span className="absolute bottom-2 right-2 text-[10px] font-mono text-on-surface-variant bg-surface-container-lowest/70 px-1.5 py-0.5 rounded">
                        ID: {p.id}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="font-label-sm text-[10px] uppercase tracking-widest text-primary font-semibold">{p.cat}</span>
                        <span className="text-[11px] text-on-surface-variant font-mono">{p.rating || '5.0'}</span>
                      </div>
                      <h4 className="font-headline-sm text-base text-on-surface font-semibold line-clamp-1">{p.name}</h4>
                      <p className="font-body-sm text-xs text-on-surface-variant line-clamp-2 mt-1">{p.desc}</p>
                    </div>
                  </div>

                  {/* Price and Action row */}
                  <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-headline-sm text-lg font-bold text-primary font-mono">
                          {formatPrice(p.price, currency)}
                        </span>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="text-xs text-on-surface-variant line-through font-mono">
                            {formatPrice(p.originalPrice, currency)}
                          </span>
                        )}
                      </div>
                      {p.discountPercent && p.discountPercent > 0 ? (
                        <span className="text-[10px] text-error font-semibold">Special Promo Active</span>
                      ) : (
                        <span className="text-[10px] text-on-surface-variant">Standard Rate</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditProduct(p)}
                        className="px-2.5 py-1.5 rounded bg-surface-container-high hover:bg-surface-bright border border-outline-variant/40 text-xs font-label-sm uppercase tracking-wider text-on-surface hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                        type="button"
                        title="Edit product, price, discount, or photo"
                      >
                        <span className="material-symbols-outlined text-[15px]">edit</span>
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="p-1.5 rounded bg-surface-container-high hover:bg-error-container/40 border border-outline-variant/40 text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                        type="button"
                        title="Delete product"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ORDERS                                                             */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
            {orders.length === 0 ? (
              <div className="py-16 text-center text-on-surface-variant flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-[36px] text-outline">inbox</span>
                <p className="text-sm">No orders recorded yet.</p>
                <p className="text-xs text-on-surface-variant/70">Place an order on the Cart page to see it recorded here live.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-container border-b border-outline-variant/30 font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Date / Time</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-surface-container-high/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-medium text-primary">{order.id}</td>
                        <td className="py-3.5 px-4 text-xs text-on-surface-variant">
                          {new Date(order.created_at).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-xs">
                          {order.customer_email || <span className="text-on-surface-variant italic">Guest Operative</span>}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-1 max-w-xs">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs">
                                <span className="w-5 h-5 rounded bg-surface-container flex items-center justify-center text-[10px] font-bold">
                                  {item.quantity}x
                                </span>
                                <span className="truncate">{item.name}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-on-surface">
                          {formatPrice(order.total, order.currency || currency)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[11px] font-label-sm uppercase font-semibold bg-secondary-container/40 text-secondary border border-secondary/30">
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ABANDONED CARTS                                                   */}
        {/* ========================================================================= */}
        {activeTab === 'abandoned' && (
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
            {abandonedCarts.length === 0 ? (
              <div className="py-16 text-center text-on-surface-variant flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-[36px] text-secondary">thumb_up</span>
                <p className="text-sm">No abandoned carts right now!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-container border-b border-outline-variant/30 font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant">
                    <tr>
                      <th className="py-3 px-4">Session / Shopper</th>
                      <th className="py-3 px-4">Last Activity</th>
                      <th className="py-3 px-4">Cart Items</th>
                      <th className="py-3 px-4">Cart Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {abandonedCarts.map((cart) => (
                      <tr key={cart.session_id} className="hover:bg-surface-container-high/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-mono text-xs text-on-surface">{cart.session_id}</span>
                            <span className="text-[11px] text-on-surface-variant">{cart.customer_email || 'Unregistered Shopper'}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-on-surface-variant">
                          {new Date(cart.updated_at).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-1 max-w-xs">
                            {cart.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs">
                                <span className="w-5 h-5 rounded bg-surface-container flex items-center justify-center text-[10px] font-bold">
                                  {item.quantity}x
                                </span>
                                <span className="truncate">{item.name}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-error">
                          {formatPrice(cart.total, currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* PRODUCT ADD / EDIT MODAL                                                  */}
      {/* ========================================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[170] flex items-center justify-center p-4 bg-surface-container-lowest/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8 rounded-2xl bg-surface-container-low border border-primary/40 p-6 md:p-8 shadow-2xl">
            
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="mb-6">
              <span className="font-label-sm text-[11px] uppercase tracking-widest text-primary font-semibold">Product Studio</span>
              <h2 className="font-headline-sm text-2xl text-on-surface font-normal">
                {editingProductId ? 'Edit Product & Pricing' : 'Add New Hardware Release'}
              </h2>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Configure features, laboratory imagery, price points, and promotional discounts.
              </p>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-error-container/40 border border-error/50 text-error text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="flex flex-col gap-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-xs font-semibold uppercase text-on-surface-variant">Product Name</label>
                  <input
                    type="text"
                    value={productForm.name || ''}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="DEERHORN Acoustic Sensor Pod"
                    required
                    className="px-3 py-2 rounded-lg bg-surface-container-high border border-outline-variant/40 focus:border-primary focus:outline-none text-on-surface text-sm"
                  />
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-xs font-semibold uppercase text-on-surface-variant">Category</label>
                  <select
                    value={productForm.cat || 'phones'}
                    onChange={(e) => setProductForm({ ...productForm, cat: e.target.value })}
                    className="px-3 py-2 rounded-lg bg-surface-container-high border border-outline-variant/40 focus:border-primary focus:outline-none text-on-surface text-sm"
                  >
                    <option value="phones">Cellular / Phones</option>
                    <option value="audio">Acoustics / Audio</option>
                    <option value="power">Induction / Power</option>
                    <option value="modules">Sensor Nodes / Modules</option>
                    <option value="accessories">Rig Accessories</option>
                  </select>
                </div>
              </div>

              {/* Price & Discount */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-xs font-semibold uppercase text-on-surface-variant">Selling Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.price || ''}
                    onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                    placeholder="349.99"
                    required
                    className="px-3 py-2 rounded-lg bg-surface-container-high border border-outline-variant/40 focus:border-primary focus:outline-none text-on-surface text-sm font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-xs font-semibold uppercase text-on-surface-variant">Discount Percentage (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={productForm.discountPercent || 0}
                    onChange={(e) => setProductForm({ ...productForm, discountPercent: parseInt(e.target.value) || 0 })}
                    placeholder="15"
                    className="px-3 py-2 rounded-lg bg-surface-container-high border border-outline-variant/40 focus:border-primary focus:outline-none text-on-surface text-sm font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-xs font-semibold uppercase text-on-surface-variant">Badge / Tag</label>
                  <input
                    type="text"
                    value={productForm.tag || ''}
                    onChange={(e) => setProductForm({ ...productForm, tag: e.target.value })}
                    placeholder="FLAGSHIP 02"
                    className="px-3 py-2 rounded-lg bg-surface-container-high border border-outline-variant/40 focus:border-primary focus:outline-none text-on-surface text-sm"
                  />
                </div>
              </div>

              {/* Photo selection */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-xs font-semibold uppercase text-on-surface-variant">Photo / Image URL</label>
                <input
                  type="url"
                  value={productForm.img || ''}
                  onChange={(e) => setProductForm({ ...productForm, img: e.target.value })}
                  placeholder="https://..."
                  required
                  className="px-3 py-2 rounded-lg bg-surface-container-high border border-outline-variant/40 focus:border-primary focus:outline-none text-on-surface text-xs font-mono"
                />

                {/* Preset Photo Selectors */}
                <div className="mt-1">
                  <span className="text-[11px] text-on-surface-variant">Or choose an authorized laboratory photo preset:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1.5">
                    {PRESET_PHOTOS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setProductForm({ ...productForm, img: preset.url })}
                        className={`p-1.5 rounded-lg border text-left flex items-center gap-2 transition-all cursor-pointer ${
                          productForm.img === preset.url 
                            ? 'border-primary bg-primary/10' 
                            : 'border-outline-variant/30 bg-surface-container hover:border-outline-variant/60'
                        }`}
                      >
                        <img src={preset.url} alt="" className="w-8 h-8 rounded object-contain bg-surface-container-high" />
                        <span className="text-[10px] text-on-surface font-medium truncate">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-xs font-semibold uppercase text-on-surface-variant">Description & Specs</label>
                <textarea
                  rows={3}
                  value={productForm.desc || ''}
                  onChange={(e) => setProductForm({ ...productForm, desc: e.target.value })}
                  placeholder="Milled seamless titanium chassis with integrated photonic waveguide display..."
                  className="px-3 py-2 rounded-lg bg-surface-container-high border border-outline-variant/40 focus:border-primary focus:outline-none text-on-surface text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-bright text-xs font-label-sm uppercase font-semibold text-on-surface transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSaving}
                  className="px-6 py-2.5 rounded-lg bg-primary text-on-primary text-xs font-label-sm uppercase tracking-wider font-bold hover:bg-primary-fixed-dim transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  {formSaving ? (
                    <>
                      <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                      <span>Saving to Backend...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">save</span>
                      <span>{editingProductId ? 'Update Product' : 'Deploy Product'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </main>
  );
}
