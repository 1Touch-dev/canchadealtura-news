import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/lib/cms-client';
import { formatRelativeDatePtBr, cn } from '@/lib/utils';

export type ArticleCardVariant = 'lead' | 'horizontal' | 'compact' | 'rail';

interface ArticleCardProps {
  article: Article;
  variant?: ArticleCardVariant;
  rank?: number;
  className?: string;
}

function PlaceholderImage({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-surface text-xs font-medium uppercase tracking-wider text-muted',
        className
      )}
    >
      Sem imagem
    </div>
  );
}

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

/** Card chrome — transform-only hover (no shadow storms). LCP lead image never fades in. */
export default function ArticleCard({
  article,
  variant = 'compact',
  rank,
  className,
}: ArticleCardProps) {
  const href = `/artigo/${article.slug}`;

  if (variant === 'lead') {
    return (
      <article
        className={cn(
          'group relative overflow-hidden rounded-lg transition-transform duration-200 ease-out will-change-transform hover:-translate-y-0.5 motion-reduce:hover:translate-y-0',
          className
        )}
      >
        <Link href={href} className={cn('block', focusRing)}>
          <div className="relative aspect-[16/9] w-full">
            {article.imageUrl ? (
              <Image
                src={article.imageUrl}
                alt=""
                fill
                className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
                sizes="(max-width: 768px) 100vw, 66vw"
                priority
              />
            ) : (
              <PlaceholderImage className="absolute inset-0" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              <span className="inline-block bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                {article.category}
              </span>
              {article.isVideo && (
                <span className="ml-2 inline-block bg-accent px-2 py-0.5 text-[10px] font-bold uppercase text-secondary">
                  Vídeo
                </span>
              )}
              <h2 className="mt-2 font-heading text-xl font-bold leading-tight text-white md:text-3xl">
                {article.title}
              </h2>
              <p className="mt-2 line-clamp-2 text-sm text-white/80">
                {article.excerpt}
              </p>
              <p className="mt-2 text-xs text-white/60">
                {article.author} · {formatRelativeDatePtBr(article.publishedAt)}
              </p>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article
        className={cn(
          'group flex gap-3 border-b border-black/10 py-3 last:border-0',
          className
        )}
      >
        <Link
          href={href}
          className={cn(
            'relative h-20 w-28 shrink-0 overflow-hidden rounded md:h-24 md:w-36',
            focusRing
          )}
        >
          {article.imageUrl ? (
            <Image
              src={article.imageUrl}
              alt=""
              fill
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
              sizes="144px"
            />
          ) : (
            <PlaceholderImage className="h-full w-full" />
          )}
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={href} className={cn('block', focusRing)}>
            <span className="text-[10px] font-bold uppercase tracking-wide text-primary">
              {article.category}
            </span>
            <h3 className="mt-0.5 font-heading text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary md:text-base">
              {article.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs text-muted">{article.excerpt}</p>
            <p className="mt-1 text-[10px] text-muted">
              {formatRelativeDatePtBr(article.publishedAt)}
              {article.isVideo && ' · Vídeo'}
            </p>
          </Link>
        </div>
      </article>
    );
  }

  if (variant === 'rail') {
    return (
      <article
        className={cn(
          'group flex items-start gap-2 border-b border-black/5 py-2 last:border-0',
          className
        )}
      >
        {rank !== undefined && (
          <span className="mt-0.5 w-5 shrink-0 font-display text-lg text-primary">
            {rank}
          </span>
        )}
        <Link href={href} className={cn('min-w-0 flex-1', focusRing)}>
          <h3 className="text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {article.title}
          </h3>
          <p className="mt-0.5 text-[10px] text-muted">
            {article.category} · {formatRelativeDatePtBr(article.publishedAt)}
          </p>
        </Link>
      </article>
    );
  }

  return (
    <article
      className={cn(
        'group transition-transform duration-200 ease-out will-change-transform hover:-translate-y-0.5 motion-reduce:hover:translate-y-0',
        className
      )}
    >
      <Link href={href} className={cn('block', focusRing)}>
        <div className="relative mb-2 aspect-[4/3] overflow-hidden rounded">
          {article.imageUrl ? (
            <Image
              src={article.imageUrl}
              alt=""
              fill
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <PlaceholderImage className="h-full w-full" />
          )}
          {article.isVideo && (
            <span className="absolute bottom-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
              Vídeo
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wide text-primary">
          {article.category}
        </span>
        <h3 className="mt-1 font-heading text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {article.title}
        </h3>
        <p className="mt-1 text-[10px] text-muted">
          {formatRelativeDatePtBr(article.publishedAt)}
        </p>
      </Link>
    </article>
  );
}
