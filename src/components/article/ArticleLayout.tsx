import Image from 'next/image';
import Link from 'next/link';
import ArticleCard from '@/components/cards/ArticleCard';
import ArticleKeyPoints from '@/components/article/ArticleKeyPoints';
import type { Article } from '@/lib/cms-client';
import { formatDatePtBr } from '@/lib/utils';
import { siteConfig } from '@/lib/site-config';
import { hasCapability } from '@/lib/capabilities';

interface ArticleLayoutProps {
  article: Article;
  related: Article[];
}

function KeyPointsBlock({
  article,
  inverted = false,
}: {
  article: Article;
  inverted?: boolean;
}) {
  if (!hasCapability('article-key-points') || !article.keyPoints?.length) {
    return null;
  }
  return (
    <ArticleKeyPoints
      points={article.keyPoints}
      title={
        article.keyPoints.length === 5
          ? 'Em 5 pontos'
          : `Em ${article.keyPoints.length} pontos`
      }
      inverted={inverted}
    />
  );
}

function Breadcrumb({ article }: { article: Article }) {
  return (
    <nav className="mb-4 text-xs text-muted">
      <Link href="/" className="hover:text-primary">
        Início
      </Link>
      <span className="mx-2">/</span>
      <Link href={`/categoria/${article.categorySlug}`} className="hover:text-primary">
        {article.category}
      </Link>
    </nav>
  );
}

function MetaBadges({ article }: { article: Article }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-white">
        {article.category}
      </span>
      {article.isVideo && (
        <span className="rounded bg-accent px-2 py-0.5 text-[10px] font-bold uppercase text-secondary">
          Vídeo
        </span>
      )}
    </div>
  );
}

function Byline({ article }: { article: Article }) {
  return (
    <p className="mt-4 text-sm text-muted">
      Por <span className="font-medium text-foreground">{article.author}</span>
      {' · '}
      {formatDatePtBr(article.publishedAt)}
      {article.readCount !== undefined &&
        ` · ${article.readCount.toLocaleString('pt-BR')} leituras`}
    </p>
  );
}

function RelatedBlock({
  related,
  variant = 'horizontal',
}: {
  related: Article[];
  variant?: 'horizontal' | 'rail' | 'compact';
}) {
  if (!related.length) return null;
  return (
    <section className="mt-12 border-t border-black/10 pt-8">
      <h2 className="font-display text-xl uppercase tracking-wide text-secondary">
        Leia também
      </h2>
      <div className={variant === 'compact' ? 'mt-4 grid gap-4 sm:grid-cols-3' : 'mt-4 space-y-2'}>
        {related.map((item) => (
          <ArticleCard key={item.id} article={item} variant={variant} />
        ))}
      </div>
    </section>
  );
}

/** Broadcast: full-bleed hero media first, then urgent story desk. */
function MediaRichStory({ article, related }: ArticleLayoutProps) {
  return (
    <article className="bg-[#0b0f14] text-white">
      {article.imageUrl && (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary md:aspect-[2.35/1]">
          <Image
            src={article.imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f14] via-[#0b0f14]/35 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-4xl px-4 pb-8 md:pb-12">
            <MetaBadges article={article} />
            <h1 className="mt-3 font-display text-3xl uppercase leading-[0.95] tracking-wide text-white md:text-5xl lg:text-6xl">
              {article.title}
            </h1>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-10">
        {!article.imageUrl && (
          <header className="mb-8">
            <Breadcrumb article={article} />
            <MetaBadges article={article} />
            <h1 className="mt-3 font-display text-3xl uppercase leading-none tracking-wide text-white md:text-5xl">
              {article.title}
            </h1>
          </header>
        )}
        {article.imageUrl && (
          <div className="mb-6 [&_a]:text-white/70 [&_a:hover]:text-accent [&_.text-muted]:text-white/55">
            <Breadcrumb article={article} />
          </div>
        )}
        {article.excerpt && (
          <p className="border-l-4 border-primary pl-4 text-lg font-medium leading-relaxed text-white/85">
            {article.excerpt}
          </p>
        )}
        <div className="mt-4 text-white/60 [&_.text-foreground]:text-white [&_.text-muted]:text-white/55">
          <Byline article={article} />
        </div>
        <KeyPointsBlock article={article} inverted />
        <div
          className="prose prose-invert mt-8 max-w-none font-body text-base leading-[1.7] prose-headings:font-display prose-headings:uppercase prose-a:text-accent"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
        <div className="[&_h2]:text-white [&_h3]:text-white [&_.text-muted]:text-white/50 [&_.text-foreground]:text-white [&_.text-primary]:text-accent [&_.border-black\\/10]:border-white/10">
          <RelatedBlock related={related} variant="horizontal" />
        </div>
      </div>
    </article>
  );
}

/** Premium: narrow longform, dek + serif body, image after intro. */
function LongformFocused({ article, related }: ArticleLayoutProps) {
  return (
    <article className="bg-[#FAFAF8]">
      <div className="mx-auto max-w-[40rem] px-5 py-12 md:py-20">
        <div className="text-center [&_.text-muted]:text-muted">
          <Breadcrumb article={article} />
        </div>
        <header className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-primary">
            {article.category}
            {article.isVideo ? ' · Vídeo' : ''}
          </p>
          <h1 className="mt-5 font-display text-3xl leading-[1.1] tracking-[-0.02em] text-secondary md:text-5xl">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mx-auto mt-6 max-w-xl font-article text-xl italic leading-relaxed text-muted">
              {article.excerpt}
            </p>
          )}
          <div className="mt-2">
            <Byline article={article} />
          </div>
        </header>

        <KeyPointsBlock article={article} />

        {article.imageUrl && (
          <figure className="relative mt-12 aspect-[16/10] overflow-hidden bg-surface">
            <Image
              src={article.imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 672px) 100vw, 640px"
              priority
            />
            <figcaption className="sr-only">{article.title}</figcaption>
          </figure>
        )}

        <div
          className="prose prose-lg prose-neutral mt-12 max-w-none font-article leading-[1.85] prose-headings:font-display prose-headings:tracking-[-0.01em] prose-p:text-secondary/90 prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
        <RelatedBlock related={related} variant="compact" />
      </div>
    </article>
  );
}

/** Modular: story column + sticky related rail. */
function SplitRailStory({ article, related }: ArticleLayoutProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumb article={article} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <article>
          <header>
            <MetaBadges article={article} />
            <h1 className="mt-3 font-heading text-2xl font-bold leading-tight text-foreground md:text-4xl">
              {article.title}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-muted">{article.excerpt}</p>
            <Byline article={article} />
          </header>

          <KeyPointsBlock article={article} />

          {article.imageUrl && (
            <div className="relative mt-6 aspect-video overflow-hidden rounded-xl">
              <Image
                src={article.imageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 800px"
                priority
              />
            </div>
          )}

          <div
            className="prose prose-neutral mt-8 max-w-none font-article leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-black/10 bg-surface p-4">
            <h2 className="font-display text-sm uppercase tracking-wider text-secondary">
              Em alta
            </h2>
            <div className="mt-3 space-y-1">
              {related.length ? (
                related.map((item, i) => (
                  <ArticleCard key={item.id} article={item} variant="rail" rank={i + 1} />
                ))
              ) : (
                <p className="text-xs text-muted">Sem artigos relacionados.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/** Interview / Q&A-forward: pull-quote dek + two-column body. */
function InterviewFocus({ article, related }: ArticleLayoutProps) {
  return (
    <article className="mx-auto max-w-6xl px-4 py-10">
      <Breadcrumb article={article} />
      <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
        <div>
          <MetaBadges article={article} />
          <h1 className="mt-4 font-heading text-3xl font-bold leading-tight md:text-5xl">
            {article.title}
          </h1>
          <blockquote className="mt-6 border-l-4 border-primary pl-4 font-article text-xl italic leading-relaxed text-secondary">
            “{article.excerpt}”
          </blockquote>
          <Byline article={article} />
          <div
            className="prose prose-neutral mt-8 max-w-none font-article"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
        <aside className="space-y-4">
          {article.imageUrl && (
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src={article.imageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="340px"
                priority
              />
            </div>
          )}
          <RelatedBlock related={related} variant="rail" />
        </aside>
      </div>
    </article>
  );
}

function GalleryLead({ article, related }: ArticleLayoutProps) {
  return (
    <article>
      <div className="grid gap-2 bg-secondary p-2 md:grid-cols-3">
        <div className="relative aspect-[4/3] md:col-span-2 md:aspect-auto md:min-h-[420px]">
          {article.imageUrl && (
            <Image
              src={article.imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 66vw"
              priority
            />
          )}
        </div>
        <div className="flex flex-col justify-end bg-black/40 p-6 text-white md:min-h-[420px]">
          <MetaBadges article={article} />
          <h1 className="mt-3 font-display text-3xl leading-tight md:text-4xl">{article.title}</h1>
          <Byline article={article} />
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
        <RelatedBlock related={related} variant="compact" />
      </div>
    </article>
  );
}

function OpinionColumn({ article, related }: ArticleLayoutProps) {
  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary">Opinião</p>
      <h1 className="mt-4 font-display text-4xl leading-[1.1] text-secondary md:text-5xl">
        {article.title}
      </h1>
      <Byline article={article} />
      {article.excerpt && (
        <p className="mt-6 text-xl leading-relaxed text-muted-text">{article.excerpt}</p>
      )}
      <div
        className="prose prose-lg mt-10 max-w-none font-body"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
      <RelatedBlock related={related} variant="horizontal" />
    </article>
  );
}

export default function ArticleLayout({ article, related }: ArticleLayoutProps) {
  switch (siteConfig.layouts.article) {
    case 'longform-focused':
      return <LongformFocused article={article} related={related} />;
    case 'split-rail-story':
      return <SplitRailStory article={article} related={related} />;
    case 'interview-focus':
      return <InterviewFocus article={article} related={related} />;
    case 'gallery-lead':
      return <GalleryLead article={article} related={related} />;
    case 'opinion-column':
      return <OpinionColumn article={article} related={related} />;
    case 'media-rich-story':
    default:
      return <MediaRichStory article={article} related={related} />;
  }
}
