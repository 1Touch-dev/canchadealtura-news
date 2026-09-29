import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EmptyState from '@/components/ui/EmptyState';
import { hasCapability } from '@/lib/capabilities';
import { hasSportsdbAuth, lookupEvent } from '@/lib/sportsdb-client';
import { siteConfig } from '@/lib/site-config';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await lookupEvent(id);
  if (!event) return { title: 'Evento' };
  return {
    title: event.name,
    description: `${event.league || 'Evento'} — ${siteConfig.siteName}`,
  };
}

export default async function EventoPage({ params }: PageProps) {
  if (!hasCapability('live-scores')) notFound();
  if (!hasSportsdbAuth()) notFound();

  const { id } = await params;
  const event = await lookupEvent(id);
  if (!event) notFound();

  const score =
    event.homeScore != null && event.awayScore != null
      ? `${event.homeScore} – ${event.awayScore}`
      : null;

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      <Link href="/esportes" className="text-xs font-semibold uppercase text-primary hover:underline">
        ← Esportes
      </Link>

      {event.thumb ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.thumb}
          alt=""
          className="max-h-56 w-full rounded-xl object-cover"
        />
      ) : null}

      <header className="space-y-2">
        {event.league ? (
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
            {event.league}
          </p>
        ) : null}
        <h1 className="font-display text-3xl uppercase tracking-wide text-secondary md:text-4xl">
          {event.home} {score ? score : 'vs'} {event.away}
        </h1>
        <p className="text-sm text-muted">
          {[event.date, event.time, event.venue, event.season, event.status]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </header>

      {!score && !event.status ? (
        <EmptyState
          title="Sem placar"
          description="Este evento ainda não tem resultado publicado."
          actionHref="/esportes"
          actionLabel="Voltar"
        />
      ) : null}
    </div>
  );
}
