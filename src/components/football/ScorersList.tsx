import type { ScorerRow } from '@/lib/football-client';

export default function ScorersList({ rows }: { rows: ScorerRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-black/10 bg-white px-4 py-8 text-sm text-muted">
        Artilharia ainda não disponível.
      </p>
    );
  }

  return (
    <ol className="divide-y divide-black/[0.06] rounded-xl border border-black/10 bg-white">
      {rows.map((row) => (
        <li
          key={`${row.rank}-${row.name}`}
          className="flex items-center gap-3 px-4 py-3"
        >
          <span className="w-6 text-right text-xs tabular-nums text-muted">
            {row.rank}
          </span>
          {row.teamLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={row.teamLogo}
              alt=""
              width={22}
              height={22}
              className="h-[22px] w-[22px] object-contain"
            />
          ) : null}
          <span className="min-w-0 flex-1">
            <span className="block truncate font-semibold text-secondary">
              {row.name}
            </span>
            {row.team ? (
              <span className="block truncate text-xs text-muted">{row.team}</span>
            ) : null}
          </span>
          <span className="font-display text-xl tabular-nums text-secondary">
            {row.goals}
          </span>
        </li>
      ))}
    </ol>
  );
}
