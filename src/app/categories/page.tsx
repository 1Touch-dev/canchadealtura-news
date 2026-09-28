import type { Metadata } from 'next';
import Link from 'next/link';
import { getCategories } from '@/lib/cms-client';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Categorias',
  description: `Explore todas as seções de ${siteConfig.siteName}`,
};

export default async function CategoriesPage() {
  const categories = await getCategories();
  const layout = siteConfig.layouts.category;

  if (layout === 'section-led-grid') {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <header className="mb-12 max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            Navegação
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold text-foreground md:text-5xl">
            Categorias
          </h1>
          <p className="mt-3 font-article text-lg italic text-muted">
            Explore as seções editoriais de {siteConfig.siteName}.
          </p>
        </header>
        <div className="divide-y divide-black/10">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categoria/${cat.slug}`}
              className="group flex items-baseline justify-between gap-4 py-6"
            >
              <h2 className="font-heading text-2xl font-bold text-foreground group-hover:text-primary">
                {cat.name}
              </h2>
              {cat.description && (
                <p className="hidden max-w-md text-right text-sm text-muted sm:block">
                  {cat.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (layout === 'dense-feed-list') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6">
        <header className="mb-6 flex items-end justify-between border-b border-black/10 pb-4">
          <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
            Categorias
          </h1>
          <span className="text-xs text-muted">{categories.length} seções</span>
        </header>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/categoria/${cat.slug}`}
              className="group flex gap-3 rounded-xl border border-black/10 bg-surface p-4 hover:border-primary/40"
            >
              <span className="font-display text-2xl text-primary">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h2 className="font-heading font-bold text-foreground group-hover:text-primary">
                  {cat.name}
                </h2>
                {cat.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-muted">{cat.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // ranked-editorial-stream default
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <header className="mb-6 border-b-4 border-primary pb-2">
        <h1 className="font-display text-3xl uppercase tracking-wide text-secondary">
          Categorias
        </h1>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categoria/${cat.slug}`}
            className="group rounded-none border-l-4 border-primary bg-surface p-6 shadow-card transition-shadow hover:shadow-elevated"
          >
            <h2 className="font-display text-xl uppercase tracking-wide text-secondary group-hover:text-primary">
              {cat.name}
            </h2>
            {cat.description && (
              <p className="mt-2 text-sm text-muted">{cat.description}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
