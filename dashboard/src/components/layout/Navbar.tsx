'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from './ThemeProvider';
import { useTranslation } from '@/i18n/useTranslation';

type NavLeaf = { href: string; labelKey: string };
type NavGroup = { labelKey: string; items: NavLeaf[] };
type NavEntry = NavLeaf | NavGroup;

function isGroup(e: NavEntry): e is NavGroup {
  return (e as NavGroup).items !== undefined;
}

const NAV: NavEntry[] = [
  { href: '/', labelKey: 'nav.home' },
  {
    labelKey: 'nav.section.people',
    items: [
      { href: '/demographics', labelKey: 'nav.people' },
      { href: '/health', labelKey: 'nav.health' },
      { href: '/education', labelKey: 'nav.education' },
      { href: '/crime', labelKey: 'nav.crime' },
    ],
  },
  {
    labelKey: 'nav.section.economy',
    items: [
      { href: '/economy', labelKey: 'nav.economy' },
      { href: '/investment', labelKey: 'nav.investment' },
      { href: '/budget', labelKey: 'nav.budget' },
      { href: '/transport', labelKey: 'nav.transport' },
    ],
  },
  {
    labelKey: 'nav.section.culture',
    items: [
      { href: '/tourism', labelKey: 'nav.tourism' },
      { href: '/culture', labelKey: 'nav.culture' },
    ],
  },
  {
    labelKey: 'nav.section.environment',
    items: [
      { href: '/climate', labelKey: 'nav.climate' },
      { href: '/environment', labelKey: 'nav.airQuality' },
    ],
  },
  { href: '/map', labelKey: 'nav.map' },
];

function ThemeIcon({ theme }: { theme: string }) {
  if (theme === 'dark') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform ${open ? 'rotate-180' : ''}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<Set<string>>(new Set());
  const navRef = useRef<HTMLDivElement>(null);

  // Close everything on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenGroup(null);
  }, [pathname]);

  // Click outside closes desktop dropdown
  useEffect(() => {
    if (!openGroup && !mobileOpen) return;
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenGroup(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openGroup, mobileOpen]);

  function toggleMobileGroup(key: string) {
    setMobileExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur" ref={navRef}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="text-lg font-bold text-ganga shrink-0">
            {t('nav.brand')}
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1 ml-4">
            {NAV.map((entry) => {
              if (!isGroup(entry)) {
                const active = pathname === entry.href;
                return (
                  <Link
                    key={entry.href}
                    href={entry.href}
                    className={`rounded-md px-3 py-1.5 text-sm whitespace-nowrap transition-colors ${
                      active
                        ? 'bg-ganga text-white'
                        : 'text-muted hover:text-foreground hover:bg-card'
                    }`}
                  >
                    {t(entry.labelKey)}
                  </Link>
                );
              }
              const groupActive = entry.items.some((i) => i.href === pathname);
              const isOpen = openGroup === entry.labelKey;
              return (
                <div key={entry.labelKey} className="relative">
                  <button
                    onClick={() => setOpenGroup(isOpen ? null : entry.labelKey)}
                    className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-sm whitespace-nowrap transition-colors ${
                      groupActive
                        ? 'bg-ganga text-white'
                        : 'text-muted hover:text-foreground hover:bg-card'
                    }`}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                  >
                    {t(entry.labelKey)}
                    <Chevron open={isOpen} />
                  </button>
                  {isOpen && (
                    <div className="absolute left-0 top-full mt-1 min-w-[180px] rounded-lg border border-border bg-card shadow-lg py-1 z-50">
                      {entry.items.map((item) => {
                        const active = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpenGroup(null)}
                            className={`block px-4 py-2 text-sm transition-colors ${
                              active
                                ? 'bg-ganga text-white'
                                : 'text-muted hover:text-foreground hover:bg-card-hover'
                            }`}
                          >
                            {t(item.labelKey)}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            <button
              onClick={toggle}
              className="ml-2 shrink-0 rounded-md p-2 text-muted hover:text-foreground hover:bg-card transition-colors"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <ThemeIcon theme={theme} />
            </button>
          </div>

          {/* Mobile: theme + hamburger */}
          <div className="flex lg:hidden items-center gap-1">
            <button
              onClick={toggle}
              className="shrink-0 rounded-md p-2.5 text-muted hover:text-foreground hover:bg-card transition-colors"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <ThemeIcon theme={theme} />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="shrink-0 rounded-md p-2.5 text-muted hover:text-foreground hover:bg-card transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {mobileOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className={`lg:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          mobileOpen ? 'max-h-[700px]' : 'max-h-0'
        }`}
      >
        <div className="border-t border-border bg-background px-2 py-2">
          {NAV.map((entry) => {
            if (!isGroup(entry)) {
              const active = pathname === entry.href;
              return (
                <Link
                  key={entry.href}
                  href={entry.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-md px-4 py-3 text-sm transition-colors ${
                    active
                      ? 'bg-ganga text-white'
                      : 'text-muted hover:text-foreground hover:bg-card'
                  }`}
                >
                  {t(entry.labelKey)}
                </Link>
              );
            }
            const groupActive = entry.items.some((i) => i.href === pathname);
            const expanded = mobileExpanded.has(entry.labelKey) || groupActive;
            return (
              <div key={entry.labelKey}>
                <button
                  onClick={() => toggleMobileGroup(entry.labelKey)}
                  className={`w-full flex items-center justify-between rounded-md px-4 py-3 text-sm transition-colors ${
                    groupActive ? 'text-foreground' : 'text-muted hover:text-foreground hover:bg-card'
                  }`}
                  aria-expanded={expanded}
                >
                  <span className="font-semibold uppercase tracking-wide text-xs">{t(entry.labelKey)}</span>
                  <Chevron open={expanded} />
                </button>
                {expanded && (
                  <div className="pl-3 pb-2">
                    {entry.items.map((item) => {
                      const active = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`block rounded-md px-4 py-2.5 text-sm transition-colors ${
                            active
                              ? 'bg-ganga text-white'
                              : 'text-muted hover:text-foreground hover:bg-card'
                          }`}
                        >
                          {t(item.labelKey)}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
