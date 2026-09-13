import React from 'react';
import { LOGO_URL } from '../data';

interface CustomerAuthGateProps {
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onContinueAsGuest: () => void;
}

export function CustomerAuthGate({ onOpenAuth, onContinueAsGuest }: CustomerAuthGateProps) {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-surface-container-lowest text-on-surface p-4 overflow-y-auto">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-lg rounded-2xl bg-surface-container-low border border-outline-variant/40 p-8 md:p-10 shadow-2xl flex flex-col items-center text-center backdrop-blur-xl">
        
        {/* Security badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-outline-variant/30 text-primary text-xs font-label-sm uppercase tracking-widest font-semibold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          <span>Security Protocol // Authorized Access Gate</span>
        </div>

        {/* Brand Logo & Name */}
        <div className="w-16 h-16 rounded-2xl bg-surface-container-high border border-outline-variant/50 p-2.5 flex items-center justify-center mb-5 shadow-inner">
          <img src={LOGO_URL} alt="DEERHORN" className="w-full h-full object-contain filter invert opacity-90" />
        </div>

        <h1 className="font-headline-lg text-3xl font-medium tracking-tight text-on-surface mb-2">
          DEERHORN LABS
        </h1>
        <p className="font-body-md text-on-surface-variant max-w-sm mb-8 leading-relaxed">
          Welcome to the private engineering showcase. Please authenticate your operative profile to explore hardware allocations, acoustics, and dispatch protocols.
        </p>

        {/* Auth Action Buttons */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => onOpenAuth('signin')}
            className="w-full py-4 px-6 rounded-xl bg-primary text-on-primary font-label-md text-sm uppercase tracking-wider font-bold hover:bg-primary-fixed-dim active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-3 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">login</span>
            <span>Sign In / Customer Login</span>
          </button>

          <button
            onClick={() => onOpenAuth('signup')}
            className="w-full py-3.5 px-6 rounded-xl bg-surface-container-high border border-outline-variant/50 text-on-surface font-label-md text-sm uppercase tracking-wider font-semibold hover:border-primary/50 hover:bg-surface-bright active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>Register New Customer Account</span>
          </button>

          {/* Guest Pass for testing */}
          <div className="pt-4 border-t border-outline-variant/30 mt-2 flex flex-col items-center gap-2">
            <button
              onClick={onContinueAsGuest}
              className="text-xs text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5 font-label-sm uppercase tracking-wider cursor-pointer"
            >
              <span>Instant Guest Operative Pass</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
            <span className="text-[11px] text-on-surface-variant/60">
              Allows immediate temporary browsing of catalog and audio matrix
            </span>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-outline-variant/20 w-full flex items-center justify-between text-[11px] text-on-surface-variant/70 font-mono">
          <span>SECURE_SESSION // v4.2</span>
          <span>256-BIT CRYPTO</span>
        </div>

      </div>
    </div>
  );
}
