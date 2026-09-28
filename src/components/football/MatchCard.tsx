import { cn } from '@/lib/utils';
import type { MatchCardModel, TeamSide } from '@/lib/football-client';
import { formatKickoff, formatKickoffTime } from '@/lib/football-client';

function Crest({ team, size = 28 }: { team: TeamSide; size?: number }) {
  if (!team.logo) {
    return (
      <span
        className="inline-flex shrink-0 items-center justify-center rounded-full bg-black/10 text-[10px] font-bold uppercase text-secondary"
        style={{ width: size, height: size }}
        aria-hidden
      >
        {team.name.slice(0, 1)}
      </span>
    );
  }
  return (
    // External API-Sports CDN — img avoids remotePatterns churn
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={team.logo}
      alt=""
      width={size}
      height={size}
      className="shrink-0 object-contain"
      style={{ width: size, height: size }}
    />
  );
}

function TeamLine({
  team,
  align,
  inverted,
}: {
  team: TeamSide;
  align: 'start' | 'end';
  inverted?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex min-w-0 items-center gap-2',
        align === 'end' && 'flex-row-reverse text-right'
      )}
    >
      <Crest team={team} />
      <span
        className={cn(
          'truncate text-sm font-semibold leading-tight',
          inverted ? 'text-white' : 'text-secondary'
        )}
      >
        {team.name}
      </span>
    </div>
  );
}

export default function MatchCard({
  match,
  variant = 'row',
}: {
  match: MatchCardModel;
  variant?: 'row' | 'compact';
}) {
  const live = match.statusKind === 'live';
  const scheduled = match.statusKind === 'scheduled';
  const score = scheduled
    ? formatKickoffTime(match.kickoff) || '—'
    : `${match.homeScore} – ${match.awayScore}`;

  if (variant === 'compact') {
    return (
      <article className="min-w-[11.5rem] px-4 py-3">
        <p
          className={cn(
            'text-[10px] font-bold uppercase tracking-wider',
            live ? 'text-accent' : 'text-white/55'
          )}
        >
          {live ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent motion-reduce:animate-none" />
              {match.status}
            </span>
          ) : (
            match.status
          )}
        </p>
        <div className="mt-2 space-y-1.5">
          <div className="flex items-center gap-2">
            <Crest team={match.home} size={20} />
            <span className="truncate text-[13px] font-semibold text-white">
              {match.home.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Crest team={match.away} size={20} />
            <span className="truncate text-[13px] font-semibold text-white">
              {match.away.name}
            </span>
          </div>
        </div>
        <p className="mt-2 font-display text-2xl tabular-nums tracking-tight text-white">
          {scheduled ? formatKickoffTime(match.kickoff) || '—' : `${match.homeScore} – ${match.awayScore}`}
        </p>
      </article>
    );
  }

  return (
    <article
      className={cn(
        'rounded-xl border border-black/[0.08] bg-white px-4 py-3.5 transition-colors duration-150',
        'hover:border-primary/40',
        live && 'border-primary/30 bg-[#0B3D2E] text-white hover:border-accent/50'
      )}
    >
      <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-wide">
        <span className={cn(live ? 'text-accent' : 'text-muted')}>
          {live ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#E11D48] motion-reduce:animate-none" />
              {match.status}
            </span>
          ) : scheduled ? (
            formatKickoff(match.kickoff) || match.status
          ) : (
            match.status
          )}
        </span>
        {match.leagueName ? (
          <span className={cn('truncate', live ? 'text-white/55' : 'text-muted')}>
            {match.leagueName}
          </span>
        ) : null}
      </div>
      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TeamLine team={match.home} align="end" inverted={live} />
        <p
          className={cn(
            'min-w-[4.5rem] text-center font-display text-2xl tabular-nums tracking-tight',
            live ? 'text-white' : 'text-secondary'
          )}
        >
          {score}
        </p>
        <TeamLine team={match.away} align="start" inverted={live} />
      </div>
      {match.venue ? (
        <p className={cn('mt-2 truncate text-xs', live ? 'text-white/50' : 'text-muted')}>
          {match.venue}
        </p>
      ) : null}
    </article>
  );
}
