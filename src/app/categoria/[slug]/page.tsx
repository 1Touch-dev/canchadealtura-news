import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import CategoryLayout from '@/components/category/CategoryLayout';
import { getByCategory, getCategories } from '@/lib/cms-client';
import { siteConfig } from '@/lib/site-config';
import { isSportsSite, navHrefForSlug } from '@/lib/competitions';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return { title: 'Categoria não encontrada' };
  }

  return {
    title: category.name,
    description: category.description ?? `Notícias de ${category.name} em ${siteConfig.siteName}`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  if (isSportsSite()) {
    const sportsHref = navHrefForSlug(slug);
    if (sportsHref !== `/categoria/${slug}`) {
      redirect(sportsHref);
    }
  }
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const articles = await getByCategory(slug, 20);

  return <CategoryLayout category={category} articles={articles} />;
}
