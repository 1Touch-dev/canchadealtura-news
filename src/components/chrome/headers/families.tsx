'use client';

import Link from 'next/link';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { siteConfig } from '@/lib/site-config';
import { resolveChrome } from '@/lib/chrome';
import { capabilityNavLinks } from '@/lib/capabilities';
import { DURATION, transition } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { getCompetitions, isSportsSite, navHrefForSlug } from '@/lib/competitions';

function LiveScoreChip() {
  return (
    <Link
      href="/ao-vivo"
      className="inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-accent/50 bg-accent/10 px-3.5 text-[10px] font-bold uppercase tracking-[0.16em] text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70 motion-reduce:animate-none" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
      </span>
      Ao vivo
    </Link>
  );
}

function SearchMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.75" />
      <path d="M16 16.5 20 20.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function EditionDate() {
  const label = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
  return (
    <p className="min-w-0 truncate text-[11px] uppercase tracking-[0.14em] text-white/45 sm:tracking-[0.18em]">
      {label}
    </p>
  );
}

function RegionSelector() {
  return (
    <div className="flex items-center gap-2 text-xs text-muted">
      <span className="font-semibold text-foreground">SP</span>
      <span aria-hidden>·</span>
      <Link href="/estados" className="hover:text-primary">
        Trocar região
      </Link>
    </div>
  );
}

export function BroadcastScoreboardHeader() {
  const chrome = resolveChrome().header;
  const [menuOpen, setMenuOpen] = useState(false);
  const [compressed, setCompressed] = useState(false);
  const reduced = useReducedMotion();
  const menuId = useId();
  const tagline = String(siteConfig.tagline || '').trim();
  const extra = capabilityNavLinks();

  useEffect(() => {
    if (chrome.stickyMode === 'none') return;
    const onScroll = () => setCompressed(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [chrome.stickyMode]);

  const showSearch = chrome.searchMode !== 'hidden';
  const monogram = siteConfig.siteName
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();

  return (
    <header
      className={cn(
        'z-50 bg-[#0c0c0c] text-white',
        chrome.stickyMode !== 'none' && 'sticky top-0',
        chrome.edgeStyle === 'flat'
          ? 'shadow-[inset_0_-3px_0_0_var(--color-primary)]'
          : 'border-b border-white/10'
      )}
    >
      <div className="border-b border-white/[0.06] bg-black/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-1">
          <EditionDate />
          {chrome.signatureModule === 'live-score-indicator' ? (
            <LiveScoreChip />
          ) : (
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
              Edição nacional
            </span>
          )}
        </div>
      </div>
      <div
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-[padding] duration-200',
          compressed && chrome.stickyMode === 'compact' ? 'py-2' : 'py-3.5'
        )}
      >
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary font-display text-sm font-bold tracking-tight text-white"
          >
            {monogram || 'CA'}
          </span>
          <span className="min-w-0">
            <span
              className={cn(
                'block truncate font-display uppercase leading-none tracking-[0.08em]',
                chrome.logoScale === 'compact' ? 'text-lg' : 'text-xl md:text-[1.65rem]',
                compressed && 'md:text-xl'
              )}
            >
              {siteConfig.siteName}
            </span>
            {tagline && !compressed ? (
              <span className="mt-1 block truncate text-[11px] tracking-wide text-white/50">
                {tagline}
              </span>
            ) : null}
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Atalhos">
          {extra.slice(0, 4).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="inline-flex min-h-11 items-center rounded-full px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75 hover:bg-white/5 hover:text-accent"
            >
              {l.label}
            </Link>
          ))}
          {showSearch ? (
            <Link
              href="/busca"
              aria-label="Buscar"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 hover:border-accent hover:text-accent"
            >
              <SearchMark />
            </Link>
          ) : null}
        </nav>
        <button
          type="button"
          className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-4 text-[11px] font-bold uppercase tracking-[0.14em] text-white hover:border-accent hover:text-accent md:hidden"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? 'Fechar' : 'Menu'}
        </button>
      </div>
      <AnimatePresence>
        {menuOpen ? (
          <motion.nav
            id={menuId}
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={transition(DURATION.base, !!reduced)}
            className="overflow-hidden border-t border-white/10 bg-[#141414] px-4 py-4 md:hidden"
          >
            <ul className="space-y-1 text-sm">
              {showSearch ? (
                <li>
                  <Link href="/busca" className="block rounded-lg px-2 py-2.5 hover:bg-white/5" onClick={() => setMenuOpen(false)}>
                    Buscar
                  </Link>
                </li>
              ) : null}
              {isSportsSite() ? (
                <>
                  <li>
                    <Link href="/ao-vivo" className="block rounded-lg px-2 py-2.5 hover:bg-white/5" onClick={() => setMenuOpen(false)}>
                      Ao vivo
                    </Link>
                  </li>
                  <li>
                    <Link href="/futebol" className="block rounded-lg px-2 py-2.5 hover:bg-white/5" onClick={() => setMenuOpen(false)}>
                      Partidas
                    </Link>
                  </li>
                  {getCompetitions().map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/liga/${c.slug}`}
                        className="block rounded-lg px-2 py-2.5 hover:bg-white/5"
                        onClick={() => setMenuOpen(false)}
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </>
              ) : (
                extra.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="block rounded-lg px-2 py-2.5 hover:bg-white/5" onClick={() => setMenuOpen(false)}>
                      {l.label}
                    </Link>
                  </li>
                ))
              )}
              {siteConfig.navCategories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={navHrefForSlug(c.slug)}
                    className="block rounded-lg px-2 py-2.5 hover:bg-white/5"
                    onClick={() => setMenuOpen(false)}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

export function EditorialCenteredHeader() {
  const chrome = resolveChrome().header;
  const tagline = String(siteConfig.tagline || '').trim();
  return (
    <header className="border-b border-black/[0.06] bg-[#FAFAF8]">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-8 text-center md:py-10">
        {chrome.signatureModule === 'edition-date' ? <EditionDate /> : null}
        <Link href="/" className="group mt-2">
          <p
            className={cn(
              'font-display tracking-[-0.02em] text-secondary transition group-hover:opacity-80',
              chrome.logoScale === 'masthead'
                ? 'text-4xl md:text-6xl'
                : 'text-3xl md:text-5xl'
            )}
          >
            {siteConfig.siteName}
          </p>
          {tagline ? (
            <p className="mt-2 font-article text-sm italic text-muted md:text-base">
              {tagline}
            </p>
          ) : null}
        </Link>
        {chrome.navPosition === 'inside-main' ? (
          <nav
            aria-label="Principais seções"
            className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 border-t border-black/10 pt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary"
          >
            {siteConfig.navCategories.slice(0, 7).map((cat) => (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                className="min-h-11 inline-flex items-center text-secondary hover:text-primary"
              >
                {cat.name}
              </Link>
            ))}
            <Link href="/busca" className="min-h-11 inline-flex items-center text-primary">
              Buscar
            </Link>
          </nav>
        ) : null}
      </div>
    </header>
  );
}

export function NewsroomCommandHeader({
  breakingText,
}: {
  breakingText?: string;
}) {
  const chrome = resolveChrome().header;
  return (
    <header
      className={cn(
        'border-b border-black/20 bg-[#121821] text-white',
        chrome.stickyMode !== 'none' && 'sticky top-0 z-50'
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2">
        <Link
          href="/"
          className="shrink-0 font-display text-lg uppercase tracking-wide md:text-xl"
        >
          {siteConfig.siteName}
        </Link>
        {chrome.signatureModule === 'breaking-command-strip' ||
        chrome.breakingPosition === 'inside-header' ? (
          <p className="hidden min-w-0 flex-1 truncate text-sm font-medium text-white/90 md:block">
            <span className="mr-2 rounded bg-[#E11D48] px-1.5 py-0.5 text-[10px] font-bold uppercase">
              Urgente
            </span>
            {breakingText ||
              `Atualização ao vivo — ${siteConfig.siteName}`}
          </p>
        ) : (
          <div className="flex-1" />
        )}
        <Link
          href="/busca"
          className="min-h-11 inline-flex items-center rounded border border-white/20 px-3 text-xs font-semibold uppercase hover:bg-white/10"
        >
          Buscar
        </Link>
        <LiveScoreChip />
      </div>
    </header>
  );
}

export function RegionalUtilityHeader() {
  const chrome = resolveChrome().header;
  return (
    <header className="border-b border-black/10 bg-surface">
      <div className="border-b border-black/5 bg-white px-4 py-1.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {chrome.signatureModule === 'region-selector' ? (
            <RegionSelector />
          ) : (
            <span className="text-xs text-muted">Edição local</span>
          )}
          <span className="text-xs text-muted">27°C</span>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
            {siteConfig.siteName.charAt(0)}
          </span>
          <div>
            <p className="font-heading text-lg font-bold text-foreground">
              {siteConfig.siteName}
            </p>
            {siteConfig.tagline ? (
              <p className="text-xs text-muted">{siteConfig.tagline}</p>
            ) : null}
          </div>
        </Link>
        <Link
          href="/busca"
          className="min-h-11 inline-flex items-center text-xs font-semibold uppercase text-primary"
        >
          Buscar
        </Link>
      </div>
    </header>
  );
}

function TrendingCarouselStrip() {
  const topics = siteConfig.navCategories.slice(0, 6);
  return (
    <div className="flex items-center gap-3 overflow-x-auto border-t border-black/5 px-4 py-2 scrollbar-none">
      <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
        Em alta
      </span>
      <div className="flex gap-2">
        {topics.map((cat, i) => (
          <Link
            key={cat.slug}
            href={`/categoria/${cat.slug}`}
            className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full bg-black/[0.04] px-3 text-[11px] font-semibold text-secondary hover:bg-primary/10 hover:text-primary"
          >
            <span className="text-[10px] text-muted">{i + 1}</span>
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

function MarketPulseStrip() {
  const ticks = [
    { label: 'Ibovespa', value: '+0,84%' },
    { label: 'USD/BRL', value: '5,12' },
    { label: 'Selic', value: '10,50%' },
  ];
  return (
    <div className="flex items-center gap-4 overflow-x-auto border-b border-black/10 bg-[#0F172A] px-4 py-1.5 text-[11px] text-white/90">
      <span className="shrink-0 font-bold uppercase tracking-wider text-accent">
        Mercados
      </span>
      {ticks.map((t) => (
        <span key={t.label} className="shrink-0 tabular-nums">
          <span className="text-white/50">{t.label}</span>{' '}
          <span className="font-semibold text-white">{t.value}</span>
        </span>
      ))}
    </div>
  );
}

/** Phase 2 — entertainment / culture chrome */
export function VisualTrendingHeader() {
  const chrome = resolveChrome().header;
  const [compressed, setCompressed] = useState(false);

  useEffect(() => {
    if (chrome.stickyMode === 'none') return;
    const onScroll = () => setCompressed(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [chrome.stickyMode]);

  return (
    <header
      className={cn(
        'z-50 border-b border-black/10 bg-white',
        chrome.stickyMode !== 'none' && 'sticky top-0'
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-7xl items-end justify-between gap-4 px-4 transition-[padding] duration-200',
          compressed && chrome.stickyMode === 'compact' ? 'py-2' : 'py-4'
        )}
      >
        <Link href="/" className="min-w-0">
          <p className="font-display text-2xl tracking-tight text-foreground md:text-3xl">
            {siteConfig.siteName}
          </p>
          {siteConfig.tagline ? (
            <p className="mt-0.5 text-xs text-muted">{siteConfig.tagline}</p>
          ) : null}
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/busca"
            className="hidden min-h-11 items-center rounded-full border border-black/10 px-4 text-xs font-semibold uppercase tracking-wide text-secondary hover:border-primary hover:text-primary sm:inline-flex"
          >
            Buscar
          </Link>
          <Link
            href="/ultimas"
            className="inline-flex min-h-11 items-center rounded-full bg-primary px-4 text-xs font-bold uppercase tracking-wide text-white"
          >
            Tendências
          </Link>
        </div>
      </div>
      {chrome.signatureModule === 'trending-carousel' ? (
        <TrendingCarouselStrip />
      ) : null}
    </header>
  );
}

/** Phase 2 — markets / business chrome */
export function BusinessMarketsHeader() {
  const chrome = resolveChrome().header;
  return (
    <header
      className={cn(
        'z-50 border-b border-black/15 bg-white',
        chrome.stickyMode !== 'none' && 'sticky top-0'
      )}
    >
      {chrome.signatureModule === 'market-pulse' ||
      chrome.breakingPosition === 'top' ? (
        <MarketPulseStrip />
      ) : null}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center border border-primary/40 bg-primary/10 font-heading text-xs font-bold text-primary">
            {siteConfig.siteName.slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate font-heading text-sm font-bold uppercase tracking-[0.12em] text-foreground">
              {siteConfig.siteName}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted">
              Economia · Negócios · Mercados
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/busca"
            className="inline-flex min-h-11 items-center border border-black/15 px-3 text-[11px] font-semibold uppercase tracking-wide text-secondary hover:border-primary hover:text-primary"
          >
            Buscar
          </Link>
          <Link
            href="/categoria/economia"
            className="hidden min-h-11 items-center bg-[#0F172A] px-3 text-[11px] font-bold uppercase tracking-wide text-white sm:inline-flex"
          >
            Painel
          </Link>
        </div>
      </div>
    </header>
  );
}
