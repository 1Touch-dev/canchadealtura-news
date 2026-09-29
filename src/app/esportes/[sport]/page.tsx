import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SportsdbEventCard from '@/components/football/SportsdbEventCard';
import EmptyState from '@/components/ui/EmptyState';
import { hasCapability } from '@/lib/capabilities';
import { fetchLivescoreBySport, hasSportsdbAuth } from '@/lib/sportsdb-client';
import { siteConfig } from '@/lib/site-config';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ sport: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sport } = await params;
  const name = decodeURIComponent(sport);
  return {
    title: name,
    description: `Ao vivo e agenda — ${name} — ${siteConfig.siteName}`,
  };
}

export default async function EsporteModalidadePage({ params }: PageProps) {
  if (!hasCapability('live-scores')) notFound();
  if (!hasSportsdbAuth()) notFound();

  const { sport } = await params;
  const name = decodeURIComponent(sport);
  const events = await fetchLivescoreBySport(name);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <Link href="/esportes" className="text-xs font-semibold uppercase text-primary hover:underline">
        ← Esportes
      </Link>

      <header className="space-y-2">
        <h1 className="font-display text-4xl uppercase tracking-wide text-secondary md:text-5xl">
          {name}
        </h1>
        <p className="text-sm text-muted">
          Livescore via{' '}
          <code className="text-[10px]">/sportsdb/v2/livescore/sport/{name}</code>
        </p>
      </header>

      {events.length === 0 ? (
        <EmptyState
          title="Nenhum jogo ao vivo"
          description="Não há eventos ao vivo para esta modalidade no momento."
          actionHref="/esportes"
          actionLabel="Ver outras modalidades"
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {events.map((event) => (
            <SportsdbEventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
