import type { Metadata } from 'next';
import Link from 'next/link';
import EmptyState from '@/components/ui/EmptyState';
import { hasCapability } from '@/lib/capabilities';
import { fetchFootballLeagues } from '@/lib/football-client';
import { getCompetitions } from '@/lib/competitions';
import { siteConfig } from '@/lib/site-config';
import { fetchAllSports, hasSportsdbAuth } from '@/lib/sportsdb-client';
import { notFound } from 'next/navigation';

export const revalidate = 120;

export const metadata: Metadata = {
  title: 'Esportes',
  description: `Modalidades e competições — ${siteConfig.siteName}`,
};

function sportSlug(name: string): string {
  return encodeURIComponent(name.trim());
}

export default async function EsportesPage() {
  if (!hasCapability('live-scores')) notFound();

  const [sports, leagues] = await Promise.all([
    hasSportsdbAuth() ? fetchAllSports() : Promise.resolve([]),
    fetchFootballLeagues('Brazil'),
  ]);
  const pack = getCompetitions();

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-8">
      <header className="space-y-3">
        <h1 className="font-display text-4xl uppercase tracking-wide text-secondary md:text-5xl">
          Esportes
        </h1>
        <p className="max-w-2xl text-sm text-muted">
          Dados dinâmicos via API-Football CMS e TheSportsDB CMS Proxy (Postman collections).
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="font-display text-2xl uppercase tracking-wide text-secondary">
          Futebol — competições
        </h2>
        <div className="flex flex-wrap gap-2">
          {pack.map((c) => (
            <Link
              key={c.slug}
              href={`/liga/${c.slug}`}
              className="rounded-full border border-black/15 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-secondary hover:border-primary hover:text-primary"
            >
              {c.name}
            </Link>
          ))}
          <Link
            href="/futebol"
            className="rounded-full bg-primary px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white"
          >
            Central de partidas
          </Link>
        </div>
      </section>

      {leagues.length > 0 ? (
        <section className="space-y-4">
          <h2 className="font-display text-2xl uppercase tracking-wide text-secondary">
            Ligas no Brasil (API)
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {leagues.slice(0, 24).map((league) => {
              const competition = pack.find((c) => c.leagueId === league.id);
              const href = competition ? `/liga/${competition.slug}` : '/futebol';
              return (
              <Link
                key={league.id}
                href={href}
                className="flex items-center gap-3 rounded-xl border border-black/10 bg-white px-3 py-2.5 transition-colors hover:border-primary/40"
              >
                {league.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={league.logo} alt="" width={32} height={32} className="object-contain" />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-xs font-bold">
                    {league.name.slice(0, 1)}
                  </span>
                )}
                <span className="min-w-0 truncate text-sm font-semibold text-secondary">
                  {league.name}
                </span>
              </Link>
              );
            })}
          </div>
          <p className="text-xs text-muted">
            Mostrando {Math.min(24, leagues.length)} de {leagues.length} ligas retornadas por{' '}
            <code className="text-[10px]">/football/leagues?country=Brazil</code>.
          </p>
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="font-display text-2xl uppercase tracking-wide text-secondary">
          Todas as modalidades
        </h2>
        {sports.length === 0 ? (
          <EmptyState
            title="TheSportsDB indisponível"
            description="Configure SPORTSDB_PROXY_INTERNAL_SECRET no servidor para carregar /sportsdb/v2/all/sports."
            actionHref="/futebol"
            actionLabel="Ir ao futebol"
          />
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {sports.map((sport) => (
              <Link
                key={sport.id}
                href={`/esportes/${sportSlug(sport.name)}`}
                className="rounded-xl border border-black/10 bg-white px-4 py-4 transition-transform hover:-translate-y-0.5 hover:border-primary/40"
              >
                <p className="font-heading text-base font-bold text-secondary">{sport.name}</p>
                {sport.format ? (
                  <p className="mt-1 text-xs text-muted">{sport.format}</p>
                ) : null}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
