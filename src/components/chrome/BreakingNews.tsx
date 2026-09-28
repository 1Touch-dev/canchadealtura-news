'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { siteConfig } from '@/lib/site-config';
import type { BreakingHeadline } from '@/lib/cms-client';
import { cn } from '@/lib/utils';

interface BreakingNewsProps {
  headlines: BreakingHeadline[];
}

export default function BreakingNews({ headlines }: BreakingNewsProps) {
  const variant = siteConfig.components.breakingNews.variant;

  if (!headlines.length) return null;

  if (variant === 'static-banner') {
    const headline = headlines[0];
    return (
      <div className="border-b border-black/10 bg-surface">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <span className="shrink-0 font-heading text-xs font-bold uppercase tracking-widest text-primary">
            Destaque
          </span>
          {headline.slug ? (
            <Link
              href={`/artigo/${headline.slug}`}
              className="text-sm font-medium text-foreground hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {headline.text}
            </Link>
          ) : (
            <p className="text-sm font-medium text-foreground">{headline.text}</p>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'rotating-banner') {
    return <RotatingBanner headlines={headlines} />;
  }

  return <LiveTicker headlines={headlines} />;
}

function LiveTicker({ headlines }: BreakingNewsProps) {
  const doubled = [...headlines, ...headlines];
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) setPaused(true);
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  return (
    <div
      className="group/ticker flex items-stretch overflow-hidden bg-primary text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        if (!document.hidden) setPaused(false);
      }}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          if (!document.hidden) setPaused(false);
        }
      }}
    >
      <div className="flex shrink-0 items-center bg-secondary px-4 py-2">
        <span className="text-[10px] font-bold uppercase tracking-widest">
          Urgente
        </span>
      </div>
      <div className="relative flex-1 overflow-hidden py-2" aria-live="polite">
        <div
          className={cn(
            'animate-ticker flex whitespace-nowrap',
            paused && 'animate-ticker-paused'
          )}
        >
          {doubled.map((headline, i) => (
            <span
              key={`${headline.id}-${i}`}
              className="inline-flex items-center px-6 text-sm"
            >
              {headline.urgent && (
                <span className="mr-2 rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold uppercase text-secondary">
                  Ao vivo
                </span>
              )}
              {headline.slug ? (
                <Link
                  href={`/artigo/${headline.slug}`}
                  className="hover:underline focus-visible:underline focus-visible:outline-none"
                >
                  {headline.text}
                </Link>
              ) : (
                headline.text
              )}
              <span className="mx-6 text-white/40" aria-hidden>
                |
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function RotatingBanner({ headlines }: BreakingNewsProps) {
  const interval =
    (siteConfig.components.breakingNews.options?.interval as number) ?? 5000;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (headlines.length <= 1 || paused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % headlines.length);
    }, interval);
    return () => clearInterval(timer);
  }, [headlines.length, interval, paused]);

  const headline = headlines[index];

  return (
    <div
      className="border-b border-black/10 bg-accent/10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5">
        <span className="shrink-0 rounded bg-accent px-2 py-0.5 text-[10px] font-bold uppercase text-white">
          Agora
        </span>
        <p className="flex-1 text-sm font-medium text-foreground transition-opacity duration-300">
          {headline.slug ? (
            <Link
              href={`/artigo/${headline.slug}`}
              className="hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {headline.text}
            </Link>
          ) : (
            headline.text
          )}
        </p>
        <div className="hidden gap-1 sm:flex">
          {headlines.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Notícia ${i + 1}`}
              className={cn(
                'h-1.5 w-4 rounded-full transition-colors',
                i === index ? 'bg-primary' : 'bg-black/20'
              )}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
