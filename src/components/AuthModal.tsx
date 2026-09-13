import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase';
import { loginAdmin } from '../services/api';
import { AdminSession } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
  onAdminSuccess?: (admin: AdminSession) => void;
}

export function AuthModal({ isOpen, onClose, onAuthSuccess, onAdminSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    if (!isSupabaseConfigured || !supabase) {
      // Graceful instant mock login if external backend is not wired
      setSuccessMsg("Signed in with Google Account!");
      setTimeout(() => {
        onAuthSuccess?.();
        onClose();
      }, 700);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      if (data?.url) {
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2.5;

        const popup = window.open(
          data.url,
          'google_oauth_popup',
          `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
        );

        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
          window.location.href = data.url;
          return;
        }

        const pollInterval = setInterval(async () => {
          if (popup.closed) {
            clearInterval(pollInterval);
            setLoading(false);
            if (supabase) {
              const { data: sessionData } = await supabase.auth.getSession();
              if (sessionData?.session) {
                setSuccessMsg("Google authorization confirmed! Welcome.");
                setTimeout(() => {
                  onAuthSuccess?.();
                  onClose();
                }, 800);
              }
            }
          }
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to authenticate with Google.');
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg("Please provide both email and password.");
      return;
    }

    setLoading(true);

    try {
      // 1. AUTO-DETECT ADMIN LOGIN
      // If the email or credentials match the admin credentials, log into Admin Dashboard directly
      const cleanEmail = email.trim().toLowerCase();
      const isAdminAttempt = cleanEmail === 'deerhorn.admin@gmail.com' || password === 'DeerhornMasterKey#2026';

      if (isAdminAttempt) {
        const adminRes = await loginAdmin(email, password);
        if (adminRes.success && adminRes.admin) {
          setSuccessMsg("Administrator Key Verified. Entering Admin Studio...");
          setTimeout(() => {
            onAdminSuccess?.(adminRes.admin);
            onClose();
          }, 800);
          return;
        }
      }

      // 2. CUSTOMER AUTHENTICATION VIA SUPABASE OR LOCAL STORAGE
      if (isSupabaseConfigured && supabase) {
        if (mode === 'signup') {
          const { error, data } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName || 'Client' } },
          });
          if (error) throw error;

          if (data.session) {
            setSuccessMsg("Account created and signed in successfully!");
            setTimeout(() => {
              onAuthSuccess?.();
              onClose();
            }, 800);
          } else {
            setSuccessMsg("Account created. Welcome to DEERHORN!");
            setTimeout(() => {
              onAuthSuccess?.();
              onClose();
            }, 800);
          }
        } else {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;

          setSuccessMsg("Authentication verified. Welcome back!");
          setTimeout(() => {
            onAuthSuccess?.();
            onClose();
          }, 800);
        }
      } else {
        // Fallback local session if Supabase is offline
        const localUser = {
          email,
          name: fullName || email.split('@')[0],
          id: 'user_' + Date.now()
        };
        localStorage.setItem('deerhorn_local_user', JSON.stringify(localUser));
        setSuccessMsg("Signed in successfully. Welcome to DEERHORN!");
        setTimeout(() => {
          onAuthSuccess?.();
          onClose();
        }, 800);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-container-lowest/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-2xl bg-surface-container-low border border-outline-variant/40 p-6 md:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/15 rounded-full blur-3xl pointer-events-none"></div>

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
          <h2 className="font-headline-sm text-2xl text-on-surface font-normal">
            {mode === 'signin' ? 'Sign In to DEERHORN' : 'Create an Account'}
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {mode === 'signin' 
              ? 'Access your profile, orders, and system settings.' 
              : 'Join for orders, firmware updates, and acoustic profiles.'}
          </p>
        </div>

        {/* Tabs: Sign In / Sign Up */}
        <div className="flex rounded-lg bg-surface-container p-1 mb-5 border border-outline-variant/30">
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMsg(null); }}
            className={`flex-1 py-1.5 text-xs font-label-sm uppercase tracking-wider rounded-md font-semibold transition-all cursor-pointer ${
              mode === 'signin' 
                ? 'bg-surface-container-high text-primary shadow-xs' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMsg(null); }}
            className={`flex-1 py-1.5 text-xs font-label-sm uppercase tracking-wider rounded-md font-semibold transition-all cursor-pointer ${
              mode === 'signup' 
                ? 'bg-surface-container-high text-primary shadow-xs' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Feedback messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-error-container/30 border border-error/40 text-error text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-secondary-container/40 border border-secondary/50 text-secondary text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} className="flex flex-col gap-3">
          {mode === 'signup' && (
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Mercer"
                className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-3.5 py-2.5 text-body-sm font-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-all"
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@deerhorn.com"
              className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-3.5 py-2.5 text-body-sm font-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-3.5 py-2.5 text-body-sm font-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-lg bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider font-semibold hover:bg-primary-fixed-dim active:scale-98 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In' : 'Complete Registration'}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5 flex items-center justify-center">
          <div className="w-full border-t border-outline-variant/30"></div>
          <span className="absolute bg-surface-container-low px-3 font-label-sm text-[10px] uppercase tracking-wider text-on-surface-variant">
            Or continue with
          </span>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-lg bg-surface-container-high border border-outline-variant/50 hover:border-primary text-on-surface font-label-md text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2.5 shadow-sm cursor-pointer disabled:opacity-50"
          type="button"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
}
