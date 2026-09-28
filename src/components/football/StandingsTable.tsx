import type { StandingRow } from '@/lib/football-client';

export default function StandingsTable({ rows }: { rows: StandingRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-black/10 bg-white px-4 py-8 text-sm text-muted">
        Classificação ainda não disponível para esta competição.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
      <table className="w-full min-w-[28rem] border-collapse text-sm">
        <caption className="sr-only">Classificação</caption>
        <thead>
          <tr className="border-b border-black/10 text-left text-[10px] font-bold uppercase tracking-wider text-muted">
            <th className="px-3 py-2.5 w-10">#</th>
            <th className="px-3 py-2.5">Time</th>
            <th className="px-3 py-2.5 text-right tabular-nums">J</th>
            <th className="px-3 py-2.5 text-right tabular-nums">SG</th>
            <th className="px-3 py-2.5 text-right tabular-nums">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={`${row.rank}-${row.team.id || row.team.name}`}
              className="border-b border-black/[0.06] last:border-0"
            >
              <td className="px-3 py-2.5 tabular-nums text-muted">{row.rank}</td>
              <td className="px-3 py-2.5">
                <span className="inline-flex min-w-0 items-center gap-2">
                  {row.team.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={row.team.logo}
                      alt=""
                      width={22}
                      height={22}
                      className="h-[22px] w-[22px] object-contain"
                    />
                  ) : null}
                  <span className="font-semibold text-secondary">{row.team.name}</span>
                </span>
              </td>
              <td className="px-3 py-2.5 text-right tabular-nums text-muted">
                {row.played}
              </td>
              <td className="px-3 py-2.5 text-right tabular-nums text-muted">
                {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
              </td>
              <td className="px-3 py-2.5 text-right font-display text-base tabular-nums text-secondary">
                {row.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
