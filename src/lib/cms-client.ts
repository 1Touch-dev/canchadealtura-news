import {
  articles as rawArticles,
  categories as fallbackCategories,
  breakingHeadlines,
  alerts as rawAlerts,
  liveStories as rawLiveStories,
  type Article,
  type Category,
  type BreakingHeadline,
  type AlertItem,
  type LiveStory,
} from '@/data/dummy';
import { siteConfig } from '@/lib/site-config';
import { isPlaceholder } from '@/lib/placeholder-registry';
import { getResolvedIntegrations, loadPublicSiteConfig } from '@/lib/public-config';
import { BRAZILIAN_STATES, getStateByUf, type BrazilianState } from '@/data/brazilian-states';

export type { Article, Category, BreakingHeadline, AlertItem, LiveStory, BrazilianState };

const CMS_BASE = (siteConfig.cms.baseUrl || '').replace(/\/$/, '');
const WEBSITE_KEY = siteConfig.cms.websiteKey;

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function cmsUrl(pathOrAbsolute?: string): string | null {
  if (!pathOrAbsolute || isPlaceholder(pathOrAbsolute)) return null;
  if (/^https?:\/\//i.test(pathOrAbsolute)) return pathOrAbsolute;
  if (!CMS_BASE) return null;
  return `${CMS_BASE}${pathOrAbsolute.startsWith('/') ? pathOrAbsolute : `/${pathOrAbsolute}`}`;
}

function articlesListUrl(extra: Record<string, string | number | undefined> = {}): string {
  const fromCatalog = cmsUrl(getResolvedIntegrations().ARTICLES_LIST);
  if (fromCatalog && !extra.category && !extra.search) {
    return fromCatalog;
  }
  const params = new URLSearchParams({
    targetWebsite: WEBSITE_KEY,
    page: String(extra.page ?? 1),
    limit: String(extra.limit ?? 40),
  });
  if (extra.category) params.set('category', String(extra.category));
  if (extra.search) params.set('search', String(extra.search));
  if (extra.slug) params.set('slug', String(extra.slug));
  return `${CMS_BASE}/ai-articles?${params.toString()}`;
}

function articleBySlugUrl(slug: string): string {
  const tmpl = cmsUrl(getResolvedIntegrations().ARTICLE_BY_SLUG);
  if (tmpl) {
    return tmpl.replace('{slug}', encodeURIComponent(slug));
  }
  return `${CMS_BASE}/ai-articles/slug/${encodeURIComponent(slug)}`;
}

function isPublic(doc: Record<string, unknown>): boolean {
  if (doc.publishState === 'needs_review') return false;
  const scheduled = doc.scheduledTime;
  if (scheduled) {
    const t = new Date(String(scheduled)).getTime();
    if (!Number.isNaN(t) && t > Date.now()) return false;
  }
  return true;
}

function mapCmsArticle(raw: Record<string, unknown>, index = 0): Article {
  const cats = Array.isArray(raw.category)
    ? (raw.category as string[])
    : raw.category
      ? [String(raw.category)]
      : [];
  const nav = siteConfig.navCategories;
  const categoryName = cats[0] || nav[index % Math.max(nav.length, 1)]?.name || 'Notícias';
  const categorySlug =
    slugify(cats[0] || '') || nav.find((c) => c.name === categoryName)?.slug || slugify(categoryName);
  const authors = Array.isArray(raw.authorNames) ? (raw.authorNames as string[]) : [];
  const images = Array.isArray(raw.imageUrls) ? (raw.imageUrls as string[]) : [];
  const seo =
    raw.seo && typeof raw.seo === 'object' ? (raw.seo as Record<string, unknown>) : {};
  const published =
    (raw.scheduledTime as string) ||
    (raw.createdAt as string) ||
    new Date().toISOString();

  return {
    id: String(raw._id || raw.id || raw.slug || index),
    slug: String(raw.slug || ''),
    title: String(raw.title || ''),
    excerpt: String(raw.summary || raw.description || seo.meta_description || ''),
    content: String(raw.content || raw.description || ''),
    category: categoryName,
    categorySlug,
    author: authors[0] || 'Redação',
    publishedAt: published,
    imageUrl: images[0],
    isVideo: Array.isArray(raw.videoUrls) && (raw.videoUrls as string[]).length > 0,
    readCount: typeof raw.views === 'number' ? raw.views : undefined,
    featured: index === 0,
  };
}

function sortByDate(items: Article[]): Article[] {
  return [...items].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

function editorialCategories(): Category[] {
  const nav = siteConfig.navCategories;
  if (nav?.length) {
    return nav.map((c) => ({
      id: `nav-${c.slug}`,
      name: c.name,
      slug: c.slug,
      description: `Cobertura de ${c.name} em ${siteConfig.siteName}`,
    }));
  }
  return fallbackCategories;
}

function withSiteCategories(items: Article[]): Article[] {
  const nav = siteConfig.navCategories;
  if (!nav?.length) return items;

  return items.map((article, index) => {
    const cat = nav[index % nav.length];
    return {
      ...article,
      category: cat.name,
      categorySlug: cat.slug,
    };
  });
}

function dummyArticles(): Article[] {
  return withSiteCategories(rawArticles);
}

let liveCache: { at: number; items: Article[] } | null = null;
const LIVE_TTL_MS = 60_000;

async function fetchLiveArticles(): Promise<Article[] | null> {
  if (!CMS_BASE || !WEBSITE_KEY) return null;
  if (liveCache && Date.now() - liveCache.at < LIVE_TTL_MS) return liveCache.items;

  try {
    await loadPublicSiteConfig();
    const res = await fetch(articlesListUrl({ limit: 40 }), {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: unknown[] } | unknown[];
    const rows = Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : [];
    const items = rows
      .filter((row): row is Record<string, unknown> => !!row && typeof row === 'object')
      .filter(isPublic)
      .map((row, i) => mapCmsArticle(row, i))
      .filter((a) => a.slug && a.title);

    if (!items.length) return null;
    liveCache = { at: Date.now(), items };
    return items;
  } catch {
    return null;
  }
}

async function resolveArticles(): Promise<Article[]> {
  const live = await fetchLiveArticles();
  if (live?.length) return live;
  return dummyArticles();
}

export async function getLatestArticles(limit = 10): Promise<Article[]> {
  return sortByDate(await resolveArticles()).slice(0, limit);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (CMS_BASE) {
    try {
      await loadPublicSiteConfig();
      const res = await fetch(articleBySlugUrl(slug), {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const raw = (await res.json()) as Record<string, unknown>;
        if (raw && isPublic(raw) && raw.slug) return mapCmsArticle(raw);
      }
    } catch {
      /* dummy fallback */
    }
  }
  const all = await resolveArticles();
  return all.find((article) => article.slug === slug) ?? null;
}

export async function getByCategory(categorySlug: string, limit = 10): Promise<Article[]> {
  const all = await resolveArticles();
  return sortByDate(all.filter((article) => article.categorySlug === categorySlug)).slice(
    0,
    limit
  );
}

export async function getMostRead(limit = 5): Promise<Article[]> {
  const all = await resolveArticles();
  return [...all]
    .sort((a, b) => (b.readCount ?? 0) - (a.readCount ?? 0))
    .slice(0, limit);
}

export async function getFeaturedArticles(limit = 3): Promise<Article[]> {
  const all = await resolveArticles();
  const featured = all.filter((a) => a.featured);
  if (featured.length >= limit) return sortByDate(featured).slice(0, limit);
  return sortByDate(all).slice(0, limit);
}

export async function search(query: string, limit = 20): Promise<Article[]> {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  if (CMS_BASE) {
    const live = await fetchLiveArticles();
    if (live) {
      return sortByDate(
        live.filter(
          (article) =>
            article.title.toLowerCase().includes(normalized) ||
            article.excerpt.toLowerCase().includes(normalized) ||
            article.category.toLowerCase().includes(normalized)
        )
      ).slice(0, limit);
    }
  }

  return sortByDate(
    dummyArticles().filter(
      (article) =>
        article.title.toLowerCase().includes(normalized) ||
        article.excerpt.toLowerCase().includes(normalized) ||
        article.category.toLowerCase().includes(normalized) ||
        article.author.toLowerCase().includes(normalized)
    )
  ).slice(0, limit);
}

export async function getCategories(): Promise<Category[]> {
  return editorialCategories();
}

export async function getBreakingHeadlines(): Promise<BreakingHeadline[]> {
  const live = await fetchLiveArticles();
  if (live?.length) {
    return live.slice(0, 8).map((a, i) => ({
      id: `brk-${a.id}`,
      text: a.title,
      slug: a.slug,
      urgent: i === 0,
    }));
  }
  return breakingHeadlines;
}

export async function getAlerts(limit = 20): Promise<AlertItem[]> {
  return [...rawAlerts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export async function getLiveStories(): Promise<LiveStory[]> {
  return rawLiveStories;
}

export async function getLiveStoryBySlug(slug: string): Promise<LiveStory | null> {
  return rawLiveStories.find((s) => s.slug === slug) ?? null;
}

export async function getBrazilianStates(): Promise<BrazilianState[]> {
  return BRAZILIAN_STATES;
}

export async function getBrazilianState(uf: string): Promise<BrazilianState | null> {
  return getStateByUf(uf) ?? null;
}
