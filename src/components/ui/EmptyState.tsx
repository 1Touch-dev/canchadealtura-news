import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
  tone?: 'broadcast' | 'magazine' | 'default';
}

/**
 * Editorial empty state — tone follows homepage DNA when omitted.
 */
export default function EmptyState({
  title = 'Nada por aqui ainda',
  description = 'Volte em breve — novas matérias estão a caminho.',
  actionHref = '/',
  actionLabel = 'Ir ao início',
  className,
  tone,
}: EmptyStateProps) {
  const resolved =
    tone ||
    (siteConfig.layouts.homepage === 'premium-magazine'
      ? 'magazine'
      : siteConfig.layouts.homepage === 'broadcast-grid'
        ? 'broadcast'
        : 'default');

  if (resolved === 'magazine') {
    return (
      <div
        className={cn(
          'mx-auto max-w-xl px-6 py-20 text-center motion-enter',
          className
        )}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-primary">
          {siteConfig.siteName}
        </p>
        <h2 className="mt-4 font-display text-3xl leading-tight text-secondary md:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-md font-article text-base italic leading-relaxed text-muted">
          {description}
        </p>
        <Link
          href={actionHref}
          className="mt-8 inline-block border-b border-primary pb-0.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
        >
          {actionLabel}
        </Link>
      </div>
    );
  }

  if (resolved === 'broadcast') {
    return (
      <div
        className={cn(
          'border border-primary/30 bg-secondary px-6 py-14 text-center text-white motion-enter',
          className
        )}
      >
        <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-accent">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" aria-hidden />
          Sem sinal
        </span>
        <h2 className="mt-3 font-display text-3xl uppercase tracking-wide md:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/75">{description}</p>
        <Link
          href={actionHref}
          className="mt-6 inline-block bg-primary px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white"
        >
          {actionLabel}
        </Link>
      </div>
    );
  }

  return (
    <div className={cn('rounded-xl border border-black/10 bg-white px-6 py-16 text-center', className)}>
      <h2 className="font-heading text-xl font-bold text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-muted">{description}</p>
      <Link href={actionHref} className="mt-5 inline-block text-sm font-semibold text-primary hover:underline">
        {actionLabel}
      </Link>
    </div>
  );
}
