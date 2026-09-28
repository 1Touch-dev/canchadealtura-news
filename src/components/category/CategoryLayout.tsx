import Link from 'next/link';
import ArticleCard from '@/components/cards/ArticleCard';
import type { Article, Category } from '@/lib/cms-client';
import { siteConfig } from '@/lib/site-config';

interface CategoryLayoutProps {
  category: Category;
  articles: Article[];
}

function CategoryHeader({
  category,
  tone = 'broadcast',
}: {
  category: Category;
  tone?: 'broadcast' | 'editorial' | 'modular';
}) {
  if (tone === 'editorial') {
    return (
      <header className="mb-10 max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
          Seção
        </p>
        <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-3 font-article text-lg italic text-muted">{category.description}</p>
        )}
      </header>
    );
  }

  if (tone === 'modular') {
    return (
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-black/10 pb-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-1 text-sm text-muted">{category.description}</p>
          )}
        </div>
        <Link href="/categories" className="text-xs font-semibold uppercase text-primary hover:underline">
          Todas as seções
        </Link>
      </header>
    );
  }

  return (
    <header className="mb-6 border-b-4 border-primary pb-2">
      <h1 className="font-display text-3xl uppercase tracking-wide text-secondary md:text-4xl">
        {category.name}
      </h1>
      {category.description && (
        <p className="mt-1 text-sm text-muted">{category.description}</p>
      )}
    </header>
  );
}

/** Broadcast: ranked lead + stream list. */
function RankedEditorialStream({ category, articles }: CategoryLayoutProps) {
  const [lead, ...rest] = articles;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <CategoryHeader category={category} tone="broadcast" />
      {articles.length === 0 ? (
        <p className="text-muted">Nenhuma notícia nesta categoria.</p>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {lead && <ArticleCard article={lead} variant="lead" />}
          <div className="space-y-1">
            {rest.slice(0, 8).map((article, i) => (
              <ArticleCard
                key={article.id}
                article={article}
                variant="rail"
                rank={i + 2}
              />
            ))}
          </div>
          {rest.length > 8 && (
            <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rest.slice(8).map((article) => (
                <ArticleCard key={article.id} article={article} variant="compact" />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Premium: spacious section-led card grid. */
function SectionLedGrid({ category, articles }: CategoryLayoutProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <CategoryHeader category={category} tone="editorial" />
      {articles.length === 0 ? (
        <p className="text-muted">Nenhuma notícia nesta categoria.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2">
          {articles.map((article, i) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant={i === 0 ? 'lead' : 'compact'}
              className={i === 0 ? 'sm:col-span-2' : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Modular: dense numbered feed + compact side cards. */
function DenseFeedList({ category, articles }: CategoryLayoutProps) {
  const [lead, ...rest] = articles;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <CategoryHeader category={category} tone="modular" />
      {articles.length === 0 ? (
        <p className="text-muted">Nenhuma notícia nesta categoria.</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-0 divide-y divide-black/10 rounded-xl border border-black/10 bg-white">
            {lead && (
              <div className="p-4">
                <ArticleCard article={lead} variant="horizontal" />
              </div>
            )}
            {rest.map((article, i) => (
              <div key={article.id} className="px-4">
                <ArticleCard article={article} variant="rail" rank={i + 2} />
              </div>
            ))}
          </div>
          <aside className="space-y-4">
            <div className="rounded-xl bg-surface p-4">
              <h2 className="font-display text-sm uppercase text-secondary">Mais lidas</h2>
              <div className="mt-3 space-y-3">
                {articles.slice(0, 4).map((article) => (
                  <ArticleCard key={`side-${article.id}`} article={article} variant="compact" />
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

/** Visual: tile mosaic category browsing. */
function MosaicTiles({ category, articles }: CategoryLayoutProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-8">
        <h1 className="font-display text-4xl uppercase tracking-wide text-secondary">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-2 max-w-2xl text-muted">{category.description}</p>
        )}
      </header>
      {articles.length === 0 ? (
        <p className="text-muted">Nenhuma notícia nesta categoria.</p>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {articles.map((article, i) => (
            <div key={article.id} className="mb-4 break-inside-avoid motion-enter">
              <ArticleCard
                article={article}
                variant={i % 5 === 0 ? 'lead' : 'compact'}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoryLayout({ category, articles }: CategoryLayoutProps) {
  switch (siteConfig.layouts.category) {
    case 'section-led-grid':
      return <SectionLedGrid category={category} articles={articles} />;
    case 'dense-feed-list':
      return <DenseFeedList category={category} articles={articles} />;
    case 'mosaic-tiles':
      return <MosaicTiles category={category} articles={articles} />;
    case 'ranked-editorial-stream':
    default:
      return <RankedEditorialStream category={category} articles={articles} />;
  }
}
