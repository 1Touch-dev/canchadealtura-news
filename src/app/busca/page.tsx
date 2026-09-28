import type { Metadata } from 'next';
import SearchLayout from '@/components/search/SearchLayout';
import { search } from '@/lib/cms-client';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Busca',
  description: `Busque notícias em ${siteConfig.siteName}`,
};

interface BuscaPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function BuscaPage({ searchParams }: BuscaPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? '';
  const results = query ? await search(query) : [];

  return <SearchLayout query={query} results={results} />;
}
