import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLiveStoryBySlug } from '@/lib/cms-client';
import { hasCapability } from '@/lib/capabilities';
import { formatDatePtBr } from '@/lib/utils';
import { siteConfig } from '@/lib/site-config';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const story = await getLiveStoryBySlug(slug);
  if (!story) return { title: 'Ao vivo' };
  return {
    title: story.title,
    description: story.summary,
  };
}

export default async function AoVivoPage({ params }: PageProps) {
  if (!hasCapability('live-blog')) notFound();
  const { slug } = await params;
  const story = await getLiveStoryBySlug(slug);
  if (!story) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="inline-flex items-center gap-2 rounded bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" aria-hidden />
        Ao vivo
      </p>
      <h1 className="mt-4 font-display text-3xl leading-tight text-secondary md:text-4xl">
        {story.title}
      </h1>
      <p className="mt-3 text-base text-muted">{story.summary}</p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-primary">
        Última atualização: {formatDatePtBr(story.updatedAt)}
      </p>

      <ol className="mt-10 space-y-0 border-l-2 border-primary/40">
        {story.updates.map((update) => (
          <li key={update.id} id={update.id} className="relative scroll-mt-28 py-5 pl-6">
            <span className="absolute -left-[5px] top-7 h-2.5 w-2.5 rounded-full bg-primary" />
            <p className="text-xs text-muted">
              <time dateTime={update.at}>{formatDatePtBr(update.at)}</time>
              {' · '}
              <span className="font-semibold text-secondary">Fonte: {update.source}</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground">{update.text}</p>
            <Link href={`#${update.id}`} className="mt-2 inline-block text-[11px] text-primary hover:underline">
              Âncora estável #{update.id}
            </Link>
          </li>
        ))}
      </ol>

      <p className="mt-8 text-xs text-muted">
        Demo de {siteConfig.siteName}. Em produção, atualizações vêm do CMS.
      </p>
    </div>
  );
}
