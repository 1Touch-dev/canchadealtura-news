import Link from 'next/link';
import { notFound } from 'next/navigation';
import MatchCard from '@/components/football/MatchCard';
import { getLatestArticles } from '@/lib/cms-client';
import ArticleCard from '@/components/cards/ArticleCard';
import { hasCapability } from '@/lib/capabilities';
import { fetchLiveMatches, fetchUpcoming } from '@/lib/football-client';
import { getCompetitions } from '@/lib/competitions';
import { siteConfig } from '@/lib/site-config';

export const revalidate = 30;

export const metadata = {
  title: 'Ao vivo',
  description: `Placares e cobertura ao vivo em ${siteConfig.siteName}`,
};

export default async function AoVivoPage() {
  const sports = hasCapability('live-scores');
  const articles = await getLatestArticles(8);
  const live = sports ? await fetchLiveMatches({ restrictToPack: true }) : [];
  const primary = getCompetitions()[0];
  const upcoming =
    sports && live.length === 0 && primary
      ? await fetchUpcoming(primary, 6)
      : [];

  if (!sports && !hasCapability('live-blog')) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <header className="border-b-4 border-primary pb-3">
        <h1 className="font-display text-4xl uppercase tracking-wide text-secondary md:text-5xl">
          Ao vivo
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Placares das competições cobertas e as últimas da redação.
        </p>
      </header>

      {sports ? (
        <section className="space-y-4" aria-label="Placar">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl uppercase tracking-wide text-secondary">
              Jogos
            </h2>
            <Link
              href="/futebol"
              className="text-xs font-semibold uppercase text-primary hover:underline"
            >
              Central de partidas
            </Link>
          </div>
          {live.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {live.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="rounded-xl border border-black/10 bg-white px-4 py-6 text-sm text-muted">
                Nenhuma partida ao vivo no momento. Confira os próximos jogos:
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {upcoming.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          )}
        </section>
      ) : null}

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-2xl uppercase tracking-wide text-secondary">
            Últimas
          </h2>
          <Link
            href="/ultimas"
            className="text-xs font-semibold uppercase text-primary hover:underline"
          >
            Ver todas
          </Link>
        </div>
        <div className="divide-y divide-black/10 rounded border border-black/10 bg-white">
          {articles.map((article) => (
            <div key={article.id} className="px-3">
              <ArticleCard article={article} variant="horizontal" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
