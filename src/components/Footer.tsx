import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LOGO_URL } from '../data';

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30 pt-space-xl pb-space-lg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-margin">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-gutter mb-space-xl">
          <div className="lg:col-span-2 flex flex-col gap-space-md">
            <div className="flex items-center gap-space-sm group">
              <img alt="DEERHORN Logo" className="h-7 w-auto object-contain brightness-90" src={LOGO_URL} />
              <span className="font-headline-sm text-headline-sm text-on-surface tracking-wide uppercase font-medium">DEERHORN</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm leading-relaxed">
              Artisanal acoustic engineering and refined hardware systems forged with tactile metals, precision balance, and understated modern warmth.
            </p>
          </div>
          <div className="flex flex-col gap-space-sm">
            <h4 className="font-label-md text-label-md uppercase tracking-wider text-on-surface font-semibold">Architecture</h4>
            <ul className="flex flex-col gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
              <li className="hover:text-primary transition-colors"><Link to="/shop-catalog">Chassis Foundry</Link></li>
              <li className="hover:text-primary transition-colors"><Link to="/shop-catalog">Acoustic Chambers</Link></li>
              <li className="hover:text-primary transition-colors"><Link to="/shop-catalog">Modular Synapse</Link></li>
              <li className="hover:text-primary transition-colors"><Link to="/shop-catalog">Tactile Alloys</Link></li>
            </ul>
          </div>
          <div className="flex flex-col gap-space-sm">
            <h4 className="font-label-md text-label-md uppercase tracking-wider text-on-surface font-semibold">Flagship Devices</h4>
            <ul className="flex flex-col gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
              <li className="hover:text-primary transition-colors"><Link to="/shop-catalog">Apex Titanium Node</Link></li>
              <li className="hover:text-primary transition-colors"><Link to="/shop-catalog">Valkyrie Mk. VII</Link></li>
              <li className="hover:text-primary transition-colors"><Link to="/shop-catalog">Chronos Audio Engine</Link></li>
              <li className="hover:text-primary transition-colors"><Link to="/shop-catalog">Limited Black Edition</Link></li>
            </ul>
          </div>
          <div className="flex flex-col gap-space-sm">
            <h4 className="font-label-md text-label-md uppercase tracking-wider text-on-surface font-semibold">Support</h4>
            <ul className="flex flex-col gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
              <li className="hover:text-primary transition-colors"><Link to="/">Firmware Archive</Link></li>
              <li className="hover:text-primary transition-colors"><Link to="/">Warranty Protocol</Link></li>
              <li className="hover:text-primary transition-colors"><Link to="/">Field Manuals</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-space-md border-t border-outline-variant/20 flex flex-col md:flex-row items-center justify-between gap-space-md">
          <span className="font-body-sm text-body-sm text-on-surface-variant">© 2025 DEERHORN Engineering Labs. All rights reserved.</span>
          <div className="flex items-center gap-space-lg font-body-sm text-body-sm text-on-surface-variant">
            <Link className="hover:text-primary transition-colors" to="/">Security Protocol</Link>
            <Link className="hover:text-primary transition-colors" to="/">Terms of Dispatch</Link>
            <Link className="hover:text-primary transition-colors" to="/">Privacy Statement</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
