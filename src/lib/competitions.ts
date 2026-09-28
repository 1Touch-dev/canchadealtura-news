/**
 * BR sports competition pack. Same league IDs as CMS /football wrappers.
 * News sites never read this unless live-scores is on.
 */

import { siteConfig } from '@/lib/site-config';
import { hasCapability } from '@/lib/capabilities';

export type CompetitionKind = 'league' | 'cup' | 'national';

export type Competition = {
  slug: string;
  name: string;
  leagueId: number;
  season: number;
  kind: CompetitionKind;
  teamId?: number;
};

export const DEFAULT_SPORTS_SEASON = 2026;

export function brazilSportsCompetitionPack(
  season = DEFAULT_SPORTS_SEASON
): Competition[] {
  return [
    {
      slug: 'brasileirao',
      name: 'Brasileirão',
      leagueId: 71,
      season,
      kind: 'league',
    },
    {
      slug: 'serie-b',
      name: 'Série B',
      leagueId: 72,
      season,
      kind: 'league',
    },
    {
      slug: 'copa-do-brasil',
      name: 'Copa do Brasil',
      leagueId: 73,
      season,
      kind: 'cup',
    },
    {
      slug: 'libertadores',
      name: 'Libertadores',
      leagueId: 13,
      season,
      kind: 'cup',
    },
    {
      slug: 'selecao',
      name: 'Seleção',
      leagueId: 34,
      season,
      teamId: 6,
      kind: 'national',
    },
  ];
}

export function isSportsSite(): boolean {
  return hasCapability('live-scores');
}

export function getCompetitions(): Competition[] {
  const stamped = siteConfig.competitions;
  if (Array.isArray(stamped) && stamped.length > 0) {
    return stamped;
  }
  if (!isSportsSite()) return [];
  return brazilSportsCompetitionPack(DEFAULT_SPORTS_SEASON);
}

export function getCompetitionBySlug(slug: string): Competition | undefined {
  return getCompetitions().find((c) => c.slug === slug);
}

export function competitionLeagueIds(): number[] {
  return getCompetitions().map((c) => c.leagueId);
}

/** Map news-nav slugs onto sports routes when live-scores is on. */
export function navHrefForSlug(slug: string): string {
  if (!isSportsSite()) return `/categoria/${slug}`;
  if (slug === 'futebol' || slug === 'esportes' || slug === 'partidas') {
    return '/futebol';
  }
  if (slug === 'ao-vivo') return '/ao-vivo';
  if (slug === 'tabelas') return '/liga/brasileirao';
  const competition = getCompetitionBySlug(slug);
  if (competition) return `/liga/${competition.slug}`;
  return `/categoria/${slug}`;
}

export function articleNavCategories() {
  if (!isSportsSite()) return siteConfig.navCategories;
  const reserved = new Set([
    'futebol',
    'esportes',
    'partidas',
    'ao-vivo',
    'tabelas',
    ...getCompetitions().map((c) => c.slug),
  ]);
  return siteConfig.navCategories.filter((c) => !reserved.has(c.slug));
}
