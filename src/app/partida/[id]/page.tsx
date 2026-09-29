import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MatchCard from '@/components/football/MatchCard';
import { hasCapability } from '@/lib/capabilities';
import {
  fetchFixtureById,
  formatKickoff,
  teamDetailPath,
} from '@/lib/football-client';
import { siteConfig } from '@/lib/site-config';

export const revalidate = 45;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const fixture = await fetchFixtureById(id);
  if (!fixture) return { title: 'Partida' };
  return {
    title: `${fixture.home.name} x ${fixture.away.name}`,
    description: `${fixture.leagueName || 'Partida'} — ${siteConfig.siteName}`,
  };
}

export default async function PartidaPage({ params }: PageProps) {
  if (!hasCapability('live-scores')) notFound();
  const { id } = await params;
  const fixture = await fetchFixtureById(id);
  if (!fixture) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-8">
      <Link href="/futebol" className="text-xs font-semibold uppercase text-primary hover:underline">
        ← Central de partidas
      </Link>

      <header className="space-y-2">
        {fixture.leagueName ? (
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
            {fixture.leagueName}
          </p>
        ) : null}
        <h1 className="font-display text-3xl uppercase tracking-wide text-secondary md:text-4xl">
          {fixture.home.name} x {fixture.away.name}
        </h1>
        <p className="text-sm text-muted">
          {[formatKickoff(fixture.kickoff), fixture.venue, fixture.referee ? `Árbitro: ${fixture.referee}` : null]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </header>

      <MatchCard match={fixture} linkable={false} />

      <section className="grid gap-3 sm:grid-cols-2">
        {fixture.home.id ? (
          <Link
            href={teamDetailPath(fixture.home.id, 'football')}
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-secondary hover:border-primary/40"
          >
            Ver {fixture.home.name}
          </Link>
        ) : null}
        {fixture.away.id ? (
          <Link
            href={teamDetailPath(fixture.away.id, 'football')}
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-secondary hover:border-primary/40"
          >
            Ver {fixture.away.name}
          </Link>
        ) : null}
      </section>

      {fixture.events.length > 0 ? (
        <section className="space-y-3">
          <h2 className="font-display text-2xl uppercase tracking-wide text-secondary">
            Lances
          </h2>
          <ol className="divide-y divide-black/[0.06] rounded-xl border border-black/10 bg-white">
            {fixture.events.map((ev, index) => (
              <li key={`${ev.minute}-${ev.type}-${index}`} className="flex gap-3 px-4 py-3 text-sm">
                <span className="w-10 shrink-0 tabular-nums text-muted">{ev.minute}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-secondary">
                    {[ev.type, ev.detail].filter(Boolean).join(' · ')}
                  </p>
                  <p className="text-muted">
                    {[ev.player, ev.assist ? `assist. ${ev.assist}` : null, ev.teamName]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {fixture.lineups.length > 0 ? (
        <section className="space-y-4">
          <h2 className="font-display text-2xl uppercase tracking-wide text-secondary">
            Escalações
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {fixture.lineups.map((side) => (
              <div
                key={side.teamName}
                className="rounded-xl border border-black/10 bg-white p-4"
              >
                <div className="flex items-center gap-2">
                  {side.teamLogo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={side.teamLogo} alt="" width={28} height={28} className="object-contain" />
                  ) : null}
                  <div>
                    <p className="font-semibold text-secondary">{side.teamName}</p>
                    <p className="text-xs text-muted">
                      {[side.formation, side.coach ? `Téc. ${side.coach}` : null]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </div>
                </div>
                <ul className="mt-3 space-y-1 text-sm">
                  {side.starters.map((player) => (
                    <li key={`${side.teamName}-${player.name}`} className="flex justify-between gap-2">
                      <span className="text-secondary">
                        {player.number ? `#${player.number} ` : ''}
                        {player.name}
                      </span>
                      {player.position ? (
                        <span className="text-xs text-muted">{player.position}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
