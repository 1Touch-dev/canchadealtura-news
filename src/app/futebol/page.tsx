import Link from 'next/link';
import { notFound } from 'next/navigation';
import MatchCard from '@/components/football/MatchCard';
import CompetitionTabs from '@/components/football/CompetitionTabs';
import { hasCapability } from '@/lib/capabilities';
import { fetchHubPayload } from '@/lib/football-client';
import { siteConfig } from '@/lib/site-config';

export const revalidate = 45;

export const metadata = {
  title: 'Partidas',
  description: `Jogos ao vivo, hoje e próximos de ${siteConfig.siteName}`,
};

export default async function FutebolHubPage() {
  if (!hasCapability('live-scores')) notFound();

  const { live, groups } = await fetchHubPayload();
  const today = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8">
      <header className="space-y-4">
        <h1 className="font-display text-4xl uppercase tracking-wide text-secondary md:text-5xl">
          Central de partidas
        </h1>
        <p className="text-sm capitalize text-muted">{today}</p>
        <CompetitionTabs />
      </header>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl uppercase tracking-wide text-secondary">
            Ao vivo agora
          </h2>
          <Link
            href="/ao-vivo"
            className="text-xs font-semibold uppercase text-primary hover:underline"
          >
            Ver ao vivo
          </Link>
        </div>
        {live.length === 0 ? (
          <p className="rounded-xl border border-black/10 bg-white px-4 py-8 text-sm text-muted">
            Nenhuma partida ao vivo no momento nas competições cobertas.
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {live.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </section>

      {groups.map(({ competition, upcoming }) => (
        <section key={competition.slug} className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl uppercase tracking-wide text-secondary">
              {competition.name}
            </h2>
            <Link
              href={`/liga/${competition.slug}`}
              className="text-xs font-semibold uppercase text-primary hover:underline"
            >
              Tabela e artilharia
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted">Sem jogos agendados nesta competição.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {upcoming.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
