'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'wb-dashboard-consent';

type Decision = 'accepted' | 'declined';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function grant() {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('consent', 'update', {
    ad_storage: 'granted',
    analytics_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
  });
}

export default function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only runs client-side after hydration — no SSR / hydration mismatch risk
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Decision | null;
      if (stored === 'accepted') {
        grant();
      } else if (stored !== 'declined') {
        // No decision yet — show the banner
        setShow(true);
      }
    } catch {
      // localStorage may be disabled (private mode in some browsers) — just show the banner
      setShow(true);
    }
  }, []);

  function handleAccept() {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch { /* ignore */ }
    grant();
    setShow(false);
  }

  function handleDecline() {
    try {
      localStorage.setItem(STORAGE_KEY, 'declined');
    } catch { /* ignore */ }
    // Default consent is already 'denied' — nothing to update
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 inset-x-0 z-[60] border-t border-border bg-background/95 backdrop-blur"
    >
      <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <p className="text-sm text-muted flex-1 leading-relaxed">
          This dashboard uses Google Analytics to understand how people find and use it —
          aggregate traffic only, no personal data. Your call.
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleDecline}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-card-hover transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="rounded-lg bg-ganga px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
