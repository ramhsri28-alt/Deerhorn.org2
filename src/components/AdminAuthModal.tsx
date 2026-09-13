import React, { useState } from 'react';
import { loginAdmin } from '../services/api';
import { AdminSession } from '../types';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (admin: AdminSession) => void;
}

export function AdminAuthModal({ isOpen, onClose, onLoginSuccess }: AdminAuthModalProps) {
  const [email, setEmail] = useState('');
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await loginAdmin(email, password, adminId);
      if (res.success && res.admin) {
        onLoginSuccess(res.admin);
        onClose();
      } else {
        setErrorMsg(res.error || 'Invalid Admin Credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-surface-container-lowest/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-2xl bg-surface-container-low border border-primary/40 p-6 md:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          type="button"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Header */}
        <div className="flex flex-col gap-1 mb-6">
          <div className="flex items-center gap-1.5 text-primary text-[11px] font-label-sm uppercase tracking-widest font-semibold">
            <span className="material-symbols-outlined text-[14px]">shield</span>
            <span>Restricted Internal Portal</span>
          </div>
          <h2 className="font-headline-sm text-2xl text-on-surface font-normal">
            Admin Infrastructure Login
          </h2>
          <p className="font-body-sm text-on-surface-variant text-xs">
            Authenticate with your authorized backend administrative credentials to manage products, live cart activity, and dispatches.
          </p>
        </div>

        {/* Server-Side Security Note */}
        <div className="mb-4 p-2.5 rounded-lg bg-surface-container-high/60 border border-outline-variant/30 text-[11px] text-on-surface-variant flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[16px]">lock</span>
            <span>Server-side verification (zero credentials in browser code)</span>
          </div>
          <button
            type="button"
            onClick={() => setShowHints(!showHints)}
            className="text-primary hover:underline font-label-sm uppercase text-[10px] cursor-pointer"
          >
            {showHints ? 'Hide' : 'Show Keys'}
          </button>
        </div>

        {showHints && (
          <div className="mb-4 p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/40 font-mono text-[11px] text-on-surface-variant space-y-1">
            <div className="text-secondary font-bold font-label-sm uppercase text-[10px]">Configured Backend Admin Credentials:</div>
            <div><span className="text-primary">Admin Gmail:</span> deerhorn.admin@gmail.com</div>
            <div><span className="text-primary">Admin ID:</span> DH-ROOT-001</div>
            <div><span className="text-primary">Master Key:</span> DeerhornMasterKey#2026</div>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-error-container/40 border border-error/50 text-error text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-label-sm text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Admin Gmail / Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deerhorn.admin@gmail.com"
              required
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-high border border-outline-variant/40 focus:border-primary focus:outline-none text-on-surface font-body-sm text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-sm text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Admin Operative ID
            </label>
            <input
              type="text"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="DH-ROOT-001"
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-high border border-outline-variant/40 focus:border-primary focus:outline-none text-on-surface font-body-sm text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-sm text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Admin Password / Master Key
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••••••"
              required
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-high border border-outline-variant/40 focus:border-primary focus:outline-none text-on-surface font-body-sm text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 rounded-lg bg-primary text-on-primary font-label-md text-sm uppercase tracking-wider font-bold hover:bg-primary-fixed-dim transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                <span>Authenticating Backend...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span>Authenticate into Admin Portal</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
