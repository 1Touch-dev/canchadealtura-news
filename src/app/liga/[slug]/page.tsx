import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MatchCard from '@/components/football/MatchCard';
import StandingsTable from '@/components/football/StandingsTable';
import ScorersList from '@/components/football/ScorersList';
import CompetitionTabs from '@/components/football/CompetitionTabs';
import { hasCapability } from '@/lib/capabilities';
import { getCompetitionBySlug } from '@/lib/competitions';
import {
  fetchScorersFor,
  fetchStandingsFor,
  fetchUpcoming,
} from '@/lib/football-client';
import { siteConfig } from '@/lib/site-config';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const competition = getCompetitionBySlug(slug);
  if (!competition) return { title: 'Liga' };
  return {
    title: competition.name,
    description: `${competition.name} — classificação, artilharia e próximos jogos em ${siteConfig.siteName}`,
  };
}

export default async function LigaPage({ params }: PageProps) {
  if (!hasCapability('live-scores')) notFound();
  const { slug } = await params;
  const competition = getCompetitionBySlug(slug);
  if (!competition) notFound();

  const [standings, scorers, upcoming] = await Promise.all([
    fetchStandingsFor(competition),
    fetchScorersFor(competition),
    fetchUpcoming(competition, 8),
  ]);

  const showTable = competition.kind !== 'cup' || standings.length > 0;

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8">
      <header className="space-y-4">
        <h1 className="font-display text-4xl uppercase tracking-wide text-secondary md:text-5xl">
          {competition.name}
        </h1>
        <p className="text-sm text-muted">Temporada {competition.season}</p>
        <CompetitionTabs activeSlug={competition.slug} />
      </header>

      {showTable ? (
        <section className="space-y-3">
          <h2 className="font-display text-2xl uppercase tracking-wide text-secondary">
            Classificação
          </h2>
          <StandingsTable rows={standings} />
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="font-display text-2xl uppercase tracking-wide text-secondary">
          Artilharia
        </h2>
        <ScorersList rows={scorers} />
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl uppercase tracking-wide text-secondary">
          Próximos jogos
        </h2>
        {upcoming.length === 0 ? (
          <p className="rounded-xl border border-black/10 bg-white px-4 py-8 text-sm text-muted">
            Sem jogos agendados nesta competição.
          </p>
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
