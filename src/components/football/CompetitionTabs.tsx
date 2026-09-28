import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getCompetitions } from '@/lib/competitions';

export default function CompetitionTabs({ activeSlug }: { activeSlug?: string }) {
  const competitions = getCompetitions();
  return (
    <nav
      className="flex gap-1 overflow-x-auto scrollbar-hide"
      aria-label="Competições"
    >
      <Link
        href="/futebol"
        className={cn(
          'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors duration-150',
          !activeSlug
            ? 'bg-secondary text-white'
            : 'border border-black/10 bg-white text-secondary hover:border-primary hover:text-primary'
        )}
      >
        Todas
      </Link>
      {competitions.map((competition) => {
        const href = `/liga/${competition.slug}`;
        const active = activeSlug === competition.slug;
        return (
          <Link
            key={competition.slug}
            href={href}
            className={cn(
              'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors duration-150',
              active
                ? 'bg-secondary text-white'
                : 'border border-black/10 bg-white text-secondary hover:border-primary hover:text-primary'
            )}
          >
            {competition.name}
          </Link>
        );
      })}
    </nav>
  );
}
