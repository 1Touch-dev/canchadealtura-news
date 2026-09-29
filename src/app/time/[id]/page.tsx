import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TeamCrest } from '@/components/football/TeamSearch';
import SportsdbEventCard from '@/components/football/SportsdbEventCard';
import EmptyState from '@/components/ui/EmptyState';
import { hasCapability } from '@/lib/capabilities';
import { fetchTeamById, fetchUpcoming, type MatchCardModel } from '@/lib/football-client';
import { getCompetitions } from '@/lib/competitions';
import {
  hasSportsdbAuth,
  lookupTeam,
  teamNext,
  teamPlayers,
  teamPrevious,
  type SportsdbEvent,
  type SportsdbPlayer,
  type SportsdbTeam,
} from '@/lib/sportsdb-client';
import MatchCard from '@/components/football/MatchCard';

export const revalidate = 60;

interface TimePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ provider?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: TimePageProps): Promise<Metadata> {
  const { id } = await params;
  const { provider } = await searchParams;
  if (provider === 'football') {
    const team = await fetchTeamById(id);
    return { title: team?.name || 'Time' };
  }
  const team = await lookupTeam(id);
  return { title: team?.name || 'Time' };
}

function EventRow({ event }: { event: SportsdbEvent }) {
  return <SportsdbEventCard event={event} />;
}

function PlayerChip({ player }: { player: SportsdbPlayer }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-black/10 bg-white px-2.5 py-2">
      {player.cutout || player.thumb ? (
        <Image
          src={(player.cutout || player.thumb)!}
          alt={player.name}
          width={36}
          height={36}
          className="rounded-full object-cover"
          unoptimized
        />
      ) : (
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary/10 text-xs font-bold text-secondary">
          {player.name.slice(0, 1)}
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-secondary">{player.name}</p>
        <p className="truncate text-[11px] text-muted">
          {[player.number ? `#${player.number}` : null, player.position, player.nationality]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </div>
    </div>
  );
}

async function SportsdbTeamView({ team }: { team: SportsdbTeam }) {
  const [next, previous, players] = await Promise.all([
    teamNext(team.id, 'v2'),
    teamPrevious(team.id, 'v2'),
    teamPlayers(team.id, 'v2'),
  ]);

  const crest = team.badge || team.logo;

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8">
      <Link href="/times" className="text-xs font-semibold uppercase text-primary hover:underline">
        ← Buscar times
      </Link>

      <header className="flex flex-col gap-6 border-b border-black/10 pb-8 md:flex-row md:items-end">
        <TeamCrest name={team.name} src={crest} size={96} />
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            TheSportsDB
          </p>
          <h1 className="font-display text-4xl uppercase tracking-wide text-secondary md:text-5xl">
            {team.name}
          </h1>
          <p className="text-sm text-muted">
            {[team.league, team.country, team.stadium, team.formed ? `Fundado ${team.formed}` : null]
              .filter(Boolean)
              .join(' · ')}
          </p>
        </div>
      </header>

      {team.description ? (
        <p className="max-w-3xl text-sm leading-relaxed text-muted line-clamp-6">
          {team.description}
        </p>
      ) : null}

      <section className="space-y-3">
        <h2 className="font-display text-2xl uppercase tracking-wide text-secondary">
          Próximos jogos
        </h2>
        {next.length === 0 ? (
          <p className="text-sm text-muted">Sem próximos jogos no momento.</p>
        ) : (
          <div className="space-y-2">
            {next.slice(0, 8).map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl uppercase tracking-wide text-secondary">
          Resultados recentes
        </h2>
        {previous.length === 0 ? (
          <p className="text-sm text-muted">Sem resultados recentes.</p>
        ) : (
          <div className="space-y-2">
            {previous.slice(0, 8).map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl uppercase tracking-wide text-secondary">Elenco</h2>
        {players.length === 0 ? (
          <p className="text-sm text-muted">Elenco indisponível.</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {players.slice(0, 30).map((player) => (
              <PlayerChip key={player.id} player={player} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

async function FootballTeamView({
  id,
}: {
  id: string;
}) {
  const team = await fetchTeamById(id);
  if (!team) {
    return (
      <EmptyState
        title="Time não encontrado"
        description="Esse ID não retornou dados no /football/teams."
        actionHref="/times"
        actionLabel="Voltar à busca"
      />
    );
  }

  const competitions = getCompetitions();
  const primary = competitions[0];
  let upcoming: MatchCardModel[] = [];
  if (primary) {
    upcoming = await fetchUpcoming(
      {
        ...primary,
        kind: 'national',
        teamId: Number(team.id),
      },
      6
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8">
      <Link href="/times" className="text-xs font-semibold uppercase text-primary hover:underline">
        ← Buscar times
      </Link>

      <header className="flex flex-col gap-6 border-b border-black/10 pb-8 md:flex-row md:items-end">
        <TeamCrest name={team.name} src={team.logo} size={96} />
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            Football API
          </p>
          <h1 className="font-display text-4xl uppercase tracking-wide text-secondary md:text-5xl">
            {team.name}
          </h1>
          <p className="text-sm text-muted">
            {[
              team.code,
              team.country,
              team.venue,
              team.venueCity,
              team.founded ? `Fundado ${team.founded}` : null,
            ]
              .filter(Boolean)
              .join(' · ')}
          </p>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="font-display text-2xl uppercase tracking-wide text-secondary">
          Próximos jogos
        </h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted">Sem jogos agendados para este time.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {upcoming.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default async function TimePage({ params, searchParams }: TimePageProps) {
  if (!hasCapability('live-scores')) notFound();

  const { id } = await params;
  const { provider } = await searchParams;

  if (provider === 'football' || !hasSportsdbAuth()) {
    return <FootballTeamView id={id} />;
  }

  const team = await lookupTeam(id);
  if (!team) {
    // Soft fallback if SportsDB miss but id looks like football id
    return <FootballTeamView id={id} />;
  }

  return <SportsdbTeamView team={team} />;
}
