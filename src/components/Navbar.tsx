import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LOGO_URL, CURRENCIES } from '../data';

interface UserProfile {
  email?: string;
  name?: string;
  avatar?: string;
}

interface NavbarProps {
  cartCount: number;
  currency: string;
  onCurrencyChange: (code: string) => void;
  user?: UserProfile | null;
  onOpenAuth: () => void;
  onSignOut?: () => void;
  isAdminAuthenticated?: boolean;
  onOpenAdminAuth?: () => void;
}

export function Navbar({ 
  cartCount, 
  currency, 
  onCurrencyChange, 
  user, 
  onOpenAuth, 
  onSignOut,
  isAdminAuthenticated,
  onOpenAdminAuth 
}: NavbarProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", to: "/" },
    { label: "Shop Catalog", to: "/shop-catalog" },
    { label: `Cart (${cartCount})`, to: "/cart" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/30 shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
      <div className="h-20 max-w-7xl mx-auto px-margin flex items-center justify-between gap-space-lg">
        <div className="flex items-center gap-space-lg">
          <Link to="/" className="flex items-center gap-space-sm group">
            <img alt="DEERHORN Logo" className="h-8 w-auto object-contain brightness-90 contrast-125" src={LOGO_URL} />
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-wide uppercase font-medium">DEERHORN</span>
            <div className="relative flex h-1.5 w-1.5 ml-space-xs">
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary/80"></span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-space-xs">
            {navItems.map((item) => {
              const isActive = currentPath === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-space-md py-space-sm rounded-lg font-label-md text-label-md uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-surface-container-high text-primary border border-outline-variant/50"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-space-md">
          <div className="relative hidden lg:block w-48">
            <span className="material-symbols-outlined absolute left-space-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
            <input
              className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg pl-9 pr-space-md py-1.5 font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all"
              placeholder="Search hardware..."
              type="text"
            />
          </div>

          {/* Currency Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCurrencyMenuOpen(prev => !prev)}
              className="flex items-center gap-1 bg-surface-container-low border border-outline-variant/40 hover:border-primary/50 rounded-lg py-1.5 px-space-sm transition-all text-left cursor-pointer"
              type="button"
              title="Switch Currency"
            >
              <span className="font-label-sm text-label-sm text-primary font-semibold tracking-wider">{currency}</span>
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant transition-transform" style={{ transform: currencyMenuOpen ? 'rotate(180deg)' : 'none' }}>expand_more</span>
            </button>

            {currencyMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-surface-container-low border border-outline-variant/50 rounded-xl shadow-2xl py-1.5 z-50 backdrop-blur-xl">
                <div className="px-3 py-1 border-b border-outline-variant/20 text-[10px] font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                  Select Currency
                </div>
                {Object.keys(CURRENCIES).map((code) => {
                  const c = CURRENCIES[code];
                  const isSelected = currency === code;
                  return (
                    <button
                      key={code}
                      onClick={() => {
                        onCurrencyChange(code);
                        setCurrencyMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between font-label-sm text-xs hover:bg-surface-container-high transition-colors cursor-pointer ${
                        isSelected ? "text-primary font-bold bg-surface-container" : "text-on-surface"
                      }`}
                      type="button"
                    >
                      <span>{c.code} ({c.symbol})</span>
                      <span className="text-[10px] text-on-surface-variant/70">{c.rate === 1.0 ? 'Base' : `${c.rate}x`}</span>
                      {isSelected && <span className="material-symbols-outlined text-primary text-[14px]">check</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button className="relative p-space-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer" type="button" aria-label="Favorites">
            <span className="material-symbols-outlined text-[20px]">favorite</span>
          </button>

          <Link className="relative p-space-xs text-on-surface-variant hover:text-primary transition-colors" to="/cart" aria-label="View Cart">
            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-on-primary font-label-sm text-[10px] font-bold">
              {cartCount}
            </span>
          </Link>

          {/* User Auth Trigger */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(prev => !prev)}
                className="flex items-center gap-2 p-1 pl-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40 hover:border-primary/50 transition-all cursor-pointer"
                type="button"
                title="Operative Profile"
              >
                <span className="font-label-sm text-xs text-primary font-medium max-w-[100px] truncate">
                  {user.name || user.email?.split('@')[0] || 'Operative'}
                </span>
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-6 h-6 rounded-full object-cover border border-primary/40" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-semibold">
                    {(user.name?.[0] || user.email?.[0] || 'O').toUpperCase()}
                  </div>
                )}
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface-container-low border border-outline-variant/50 rounded-xl shadow-2xl py-2 z-50 backdrop-blur-xl">
                  <div className="px-4 py-2 border-b border-outline-variant/20">
                    <p className="font-label-sm text-[10px] text-primary uppercase tracking-wider font-semibold">Logged in as</p>
                    <p className="font-body-sm text-xs text-on-surface truncate mt-0.5">{user.email || user.name}</p>
                  </div>
                  {isAdminAuthenticated && (
                    <Link
                      to="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full px-4 py-2 text-left flex items-center gap-2 text-xs font-label-sm text-primary hover:bg-surface-container-high transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                      <span>Admin Control Center</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onSignOut?.();
                    }}
                    className="w-full px-4 py-2 text-left flex items-center gap-2 text-xs font-label-sm text-error hover:bg-surface-container-high transition-colors cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/40 hover:bg-primary hover:text-on-primary text-primary font-label-sm text-label-sm uppercase tracking-wider font-semibold transition-all shadow-sm cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">account_circle</span>
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
