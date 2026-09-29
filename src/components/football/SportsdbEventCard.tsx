import Link from 'next/link';
import type { SportsdbEvent } from '@/lib/sportsdb-client';
import { sportsEventPath } from '@/lib/sportsdb-client';

export default function SportsdbEventCard({ event }: { event: SportsdbEvent }) {
  const score =
    event.homeScore != null && event.awayScore != null
      ? `${event.homeScore} – ${event.awayScore}`
      : 'vs';

  return (
    <Link
      href={sportsEventPath(event.id)}
      className="block rounded-xl border border-black/10 bg-white px-4 py-3.5 transition-colors hover:border-primary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <div className="flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
        <span>{event.status || 'Agendado'}</span>
        {event.league ? <span className="truncate">{event.league}</span> : null}
      </div>
      <p className="mt-2 font-heading text-base font-bold text-secondary">
        {event.home}{' '}
        <span className="font-display text-xl tabular-nums text-primary">{score}</span>{' '}
        {event.away}
      </p>
      <p className="mt-1 truncate text-xs text-muted">
        {[event.date, event.time, event.venue].filter(Boolean).join(' · ')}
      </p>
    </Link>
  );
}
