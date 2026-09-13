import React, { useState, useEffect, useCallback } from 'react';
import { MemoryRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { ShopCatalogPage } from './components/ShopCatalogPage';
import { FlagshipDetailPage } from './components/FlagshipDetailPage';
import { CartPage } from './components/CartPage';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { CartItem, CatalogProduct, AdminSession } from './types';
import { supabase, isSupabaseConfigured } from './supabase';
import { fetchCatalogProducts, sendCartEvent, getStoredAdminSession } from './services/api';
import { getCartSessionId } from './services/database';

function RouteRedirectWatcher({ target, onCleared }: { target: string | null; onCleared: () => void }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (target) {
      navigate(target);
      onCleared();
    }
  }, [target, navigate, onCleared]);
  return null;
}

export default function App() {
  const [currency, setCurrency] = useState("USD");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  
  // Customer authentication state
  const [user, setUser] = useState<{ email?: string; name?: string; avatar?: string } | null>(() => {
    try {
      const savedUser = localStorage.getItem('deerhorn_customer_user') || localStorage.getItem('deerhorn_local_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Admin authentication state
  const [adminSession, setAdminSession] = useState<AdminSession | null>(() => getStoredAdminSession());

  // Dynamic Catalog State (managed via Admin backend)
  const [products, setProducts] = useState<CatalogProduct[]>([]);

  const refreshProducts = useCallback(async () => {
    const list = await fetchCatalogProducts();
    setProducts(list);
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  // Cart State (persisted locally)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('deerhorn_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('deerhorn_cart_items', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Failed to save cart:', e);
    }
  }, [cartItems]);

  // Handle Supabase auth state changes
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    // Fetch active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const profile = {
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
          avatar: session.user.user_metadata?.avatar_url,
        };
        setUser(profile);
        localStorage.setItem('deerhorn_customer_user', JSON.stringify(profile));
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const profile = {
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
          avatar: session.user.user_metadata?.avatar_url,
        };
        setUser(profile);
        localStorage.setItem('deerhorn_customer_user', JSON.stringify(profile));

        // Close OAuth popup if applicable
        if (window.opener && window.name === 'google_oauth_popup') {
          try {
            window.opener.postMessage({ type: 'SUPABASE_AUTH_SUCCESS' }, '*');
            window.close();
          } catch (e) {
            console.warn('Could not postMessage to opener:', e);
          }
        }
      } else {
        setUser(null);
        localStorage.removeItem('deerhorn_customer_user');
      }
    });

    const handleAuthMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SUPABASE_AUTH_SUCCESS') {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            const profile = {
              email: session.user.email,
              name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
              avatar: session.user.user_metadata?.avatar_url,
            };
            setUser(profile);
            localStorage.setItem('deerhorn_customer_user', JSON.stringify(profile));
            setIsAuthModalOpen(false);
          }
        });
      }
    };
    window.addEventListener('message', handleAuthMessage);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('message', handleAuthMessage);
    };
  }, []);

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('deerhorn_customer_user');
    localStorage.removeItem('deerhorn_local_user');
  };

  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  // Live cart activity logging & state update
  const handleAddToCart = (product: CartItem) => {
    setCartItems(prev => {
      const id = product.id || 'item-' + Date.now();
      const existing = prev.find(i => i.id === id || i.name === product.name);
      let updatedCart: CartItem[];

      if (existing) {
        updatedCart = prev.map(i => (i.id === existing.id)
          ? { ...i, quantity: i.quantity + (product.quantity || 1) }
          : i
        );
      } else {
        updatedCart = [...prev, {
          id: id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category || 'Hardware Module',
          quantity: product.quantity || 1
        }];
      }

      const total = updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // DISPATCH LIVE CART EVENT TO BACKEND SERVER (Feeds the Admin Live Cart Monitor)
      sendCartEvent({
        sessionId: getCartSessionId(),
        userEmail: user?.email,
        action: 'added',
        item: {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: product.quantity || 1,
          image: product.image,
          category: product.category
        },
        currentCart: updatedCart,
        cartTotal: total
      });

      return updatedCart;
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter((item): item is CartItem => item !== null);

      const total = updated.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const changedItem = prev.find(i => i.id === id);

      if (changedItem) {
        sendCartEvent({
          sessionId: getCartSessionId(),
          userEmail: user?.email,
          action: delta > 0 ? 'added' : 'removed',
          item: {
            id: changedItem.id,
            name: changedItem.name,
            price: changedItem.price,
            quantity: Math.abs(delta),
            image: changedItem.image,
            category: changedItem.category
          },
          currentCart: updated,
          cartTotal: total
        });
      }

      return updated;
    });
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <MemoryRouter initialEntries={["/"]} initialIndex={0}>
      <RouteRedirectWatcher target={pendingRoute} onCleared={() => setPendingRoute(null)} />
      <div className="min-h-screen flex flex-col justify-between bg-background selection:bg-primary/20 selection:text-primary">
        
        <Navbar 
          cartCount={cartCount} 
          currency={currency} 
          onCurrencyChange={setCurrency}
          user={user}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onSignOut={handleSignOut}
          isAdminAuthenticated={adminSession !== null}
        />

        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage onAddToCart={handleAddToCart} currency={currency} />} />
            <Route path="/shop-catalog" element={<ShopCatalogPage onAddToCart={handleAddToCart} currency={currency} products={products} />} />
            <Route path="/flagship-detail" element={<FlagshipDetailPage onAddToCart={handleAddToCart} currency={currency} />} />
            <Route path="/cart" element={
              <CartPage 
                cartItems={cartItems} 
                onUpdateQuantity={handleUpdateQuantity} 
                onRemoveItem={handleRemoveItem} 
                onClearCart={handleClearCart} 
                currency={currency} 
                userEmail={user?.email} 
              />
            } />
            
            {/* Admin Dashboard Route: Protected by Admin Session */}
            <Route path="/admin" element={
              adminSession ? (
                <AdminDashboard 
                  currency={currency} 
                  adminSession={adminSession}
                  onAdminLogout={() => setAdminSession(null)}
                  onCatalogUpdated={refreshProducts}
                />
              ) : (
                <div className="min-h-screen flex items-center justify-center p-6 bg-background">
                  <div className="max-w-md w-full rounded-2xl bg-surface-container-low border border-outline-variant/30 p-8 text-center flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center text-primary mb-4">
                      <span className="material-symbols-outlined text-[32px]">shield_lock</span>
                    </div>
                    <h2 className="font-headline-sm text-2xl font-medium text-on-surface mb-2">
                      Restricted Admin Matrix
                    </h2>
                    <p className="text-xs text-on-surface-variant mb-6">
                      This operational environment requires administrative verification. Please sign in with your administrative credentials.
                    </p>
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="w-full py-3.5 px-6 rounded-xl bg-primary text-on-primary font-label-md text-sm uppercase tracking-wider font-bold hover:bg-primary-fixed-dim transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">key</span>
                      <span>Sign In with Admin Credentials</span>
                    </button>
                  </div>
                </div>
              )
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <Footer />

        {/* Unified Authentication Modal (Auto-detects Admin credentials) */}
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)}
          onAdminSuccess={(admin) => {
            setAdminSession(admin);
            setPendingRoute('/admin');
          }}
        />

      </div>
    </MemoryRouter>
  );
}
