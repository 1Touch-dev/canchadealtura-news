import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export type TeamListItem = {
  id: string;
  name: string;
  badge?: string;
  country?: string;
  league?: string;
  venue?: string;
  provider: 'sportsdb' | 'football';
};

export function TeamCrest({
  name,
  src,
  size = 48,
}: {
  name: string;
  src?: string;
  size?: number;
}) {
  if (!src) {
    return (
      <span
        className="inline-flex shrink-0 items-center justify-center rounded-full bg-secondary/10 font-bold text-secondary"
        style={{ width: size, height: size, fontSize: size * 0.35 }}
        aria-hidden
      >
        {name.slice(0, 1)}
      </span>
    );
  }
  return (
    <Image
      src={src}
      alt={name}
      width={size}
      height={size}
      className="shrink-0 object-contain"
      unoptimized
    />
  );
}

export function TeamResultCard({ team }: { team: TeamListItem }) {
  const href =
    team.provider === 'football'
      ? `/time/${team.id}?provider=football`
      : `/time/${team.id}`;

  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-xl border border-black/10 bg-white px-4 py-3 transition-colors hover:border-primary/40 hover:bg-surface/60"
    >
      <TeamCrest name={team.name} src={team.badge} size={44} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-heading text-base font-bold text-secondary">
          {team.name}
        </p>
        <p className="mt-0.5 truncate text-xs text-muted">
          {[team.league, team.country, team.venue].filter(Boolean).join(' · ') ||
            'Time'}
        </p>
      </div>
      <span
        className={cn(
          'shrink-0 text-[10px] font-bold uppercase tracking-wide',
          team.provider === 'sportsdb' ? 'text-primary' : 'text-muted'
        )}
      >
        {team.provider === 'sportsdb' ? 'SportsDB' : 'API'}
      </span>
    </Link>
  );
}

export function TeamSearchForm({
  query,
  league,
  country,
}: {
  query: string;
  league?: string;
  country?: string;
}) {
  return (
    <form action="/times" method="get" className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Buscar time (ex: Flamengo, Palmeiras…)"
          className="flex-1 rounded border border-black/20 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
          autoComplete="off"
        />
        <button
          type="submit"
          className="rounded bg-primary px-6 py-2.5 text-sm font-bold uppercase text-white transition-transform motion-energetic:hover:scale-[1.02]"
        >
          Buscar
        </button>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          type="text"
          name="league"
          defaultValue={league || ''}
          placeholder="Liga (opcional, ex: Brazilian Serie A)"
          className="rounded border border-black/15 bg-white px-3 py-2 text-xs focus:border-primary focus:outline-none"
        />
        <input
          type="text"
          name="country"
          defaultValue={country || ''}
          placeholder="País (opcional, ex: Brazil)"
          className="rounded border border-black/15 bg-white px-3 py-2 text-xs focus:border-primary focus:outline-none"
        />
      </div>
    </form>
  );
}
