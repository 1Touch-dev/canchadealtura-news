import type { ArticleCardVariant } from '@/components/cards/ArticleCard';

/** Map design-system card IDs → ArticleCard visual variants. */
export function resolveCardVariant(designVariant?: string): ArticleCardVariant {
  switch (designVariant) {
    case 'photo-overlay':
    case 'image-first-large':
      return 'lead';
    case 'horizontal-compact':
    case 'horizontal-balanced':
      return 'horizontal';
    case 'vertical-editorial':
    case 'balanced-card':
    case 'text-first-compact':
      return 'compact';
    case 'ranked-rail':
    case 'numbered-list':
      return 'rail';
    default:
      return 'horizontal';
  }
}

export function resolveFeaturedCardVariant(designVariant?: string): ArticleCardVariant {
  switch (designVariant) {
    case 'photo-overlay':
    case 'image-first-large':
      return 'lead';
    case 'balanced-card':
      return 'compact';
    default:
      return 'lead';
  }
}
