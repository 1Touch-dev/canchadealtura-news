import type { Metadata } from 'next';
import CompetitionTabs from '@/components/football/CompetitionTabs';
import {
  TeamResultCard,
  TeamSearchForm,
  type TeamListItem,
} from '@/components/football/TeamSearch';
import EmptyState from '@/components/ui/EmptyState';
import { hasCapability } from '@/lib/capabilities';
import { searchFootballTeams } from '@/lib/football-client';
import { siteConfig } from '@/lib/site-config';
import {
  hasSportsdbAuth,
  searchTeams,
  searchTeamsByLeague,
} from '@/lib/sportsdb-client';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Times',
  description: `Busca de times — ${siteConfig.siteName}`,
};

interface TimesPageProps {
  searchParams: Promise<{ q?: string; league?: string; country?: string }>;
}

export default async function TimesPage({ searchParams }: TimesPageProps) {
  if (!hasCapability('live-scores')) notFound();

  const { q, league, country } = await searchParams;
  const query = q?.trim() ?? '';
  const leagueName = league?.trim() ?? '';
  const countryName = country?.trim() ?? '';

  let results: TeamListItem[] = [];
  let source: 'sportsdb' | 'football' | 'none' = 'none';

  if (query || leagueName) {
    if (hasSportsdbAuth()) {
      if (leagueName) {
        const byLeague = await searchTeamsByLeague({
          league: leagueName,
          sport: 'Soccer',
          country: countryName || 'Brazil',
        });
        results = byLeague.map((t) => ({
          id: t.id,
          name: t.name,
          badge: t.badge || t.logo,
          country: t.country,
          league: t.league,
          venue: t.stadium,
          provider: 'sportsdb' as const,
        }));
        if (query) {
          const needle = query.toLowerCase();
          results = results.filter((t) => t.name.toLowerCase().includes(needle));
        }
      } else {
        const teams = await searchTeams(query);
        results = teams.map((t) => ({
          id: t.id,
          name: t.name,
          badge: t.badge || t.logo,
          country: t.country,
          league: t.league,
          venue: t.stadium,
          provider: 'sportsdb' as const,
        }));
      }
      if (results.length > 0) source = 'sportsdb';
    }

    if (results.length === 0 && query) {
      const fb = await searchFootballTeams(query);
      results = fb.map((t) => ({
        id: t.id,
        name: t.name,
        badge: t.logo,
        country: t.country,
        venue: t.venue,
        provider: 'football' as const,
      }));
      if (results.length > 0) source = 'football';
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <header className="space-y-4">
        <h1 className="font-display text-4xl uppercase tracking-wide text-secondary md:text-5xl">
          Buscar times
        </h1>
        <p className="max-w-2xl text-sm text-muted">
          Pesquisa via TheSportsDB CMS Proxy
          {hasSportsdbAuth()
            ? ' (autenticado).'
            : ' — sem secret no servidor, usando fallback /football/teams.'}{' '}
          Base: {siteConfig.cms.baseUrl}
        </p>
        <CompetitionTabs />
      </header>

      <TeamSearchForm query={query} league={leagueName} country={countryName} />

      {!query && !leagueName && (
        <EmptyState
          title="Digite o nome de um time"
          description="Ex.: Flamengo, Corinthians, Palmeiras. Também dá para filtrar por liga/país."
          actionHref="/futebol"
          actionLabel="Ver partidas"
        />
      )}

      {(query || leagueName) && results.length === 0 && (
        <EmptyState
          title="Nenhum time encontrado"
          description="Tente outro nome ou configure SPORTSDB_PROXY_INTERNAL_SECRET no servidor."
          actionHref="/times"
          actionLabel="Limpar busca"
        />
      )}

      {results.length > 0 && (
        <section className="space-y-3">
          <p className="text-sm text-muted">
            {results.length} resultado{results.length !== 1 ? 's' : ''}
            {query ? (
              <>
                {' '}
                para &ldquo;{query}&rdquo;
              </>
            ) : null}
            {source !== 'none' ? (
              <span className="ml-2 text-[10px] font-bold uppercase tracking-wide text-primary">
                via {source}
              </span>
            ) : null}
          </p>
          <div className="grid gap-2 md:grid-cols-2">
            {results.map((team) => (
              <TeamResultCard key={`${team.provider}-${team.id}`} team={team} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
