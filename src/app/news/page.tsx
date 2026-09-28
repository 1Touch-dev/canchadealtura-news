import type { Metadata } from 'next';
import ArticleCard from '@/components/cards/ArticleCard';
import { getLatestArticles } from '@/lib/cms-client';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Últimas notícias',
  description: `Todas as últimas notícias de ${siteConfig.siteName}`,
};

export default async function NewsPage() {
  const articles = await getLatestArticles(20);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <header className="mb-6 border-b-2 border-primary pb-2">
        <h1 className="font-display text-3xl uppercase tracking-wide text-secondary">
          Últimas notícias
        </h1>
        <p className="mt-1 text-sm text-muted">Cobertura completa em tempo real</p>
      </header>
      <div className="divide-y divide-black/10 rounded border border-black/10 bg-white">
        {articles.map((article) => (
          <div key={article.id} className="px-4">
            <ArticleCard article={article} variant="horizontal" />
          </div>
        ))}
      </div>
    </div>
  );
}
