/**
 * "Em N pontos" summary — enabled via siteConfig.capabilities.
 */

interface ArticleKeyPointsProps {
  points: string[];
  title?: string;
  /** Dark surfaces (broadcast article) */
  inverted?: boolean;
}

export default function ArticleKeyPoints({
  points,
  title = 'Em 5 pontos',
  inverted = false,
}: ArticleKeyPointsProps) {
  if (!points?.length) return null;

  return (
    <aside
      className={
        inverted
          ? 'my-8 rounded-lg border border-white/15 bg-white/5 p-5'
          : 'my-8 rounded-lg border border-black/10 bg-surface p-5'
      }
      aria-label={title}
    >
      <h2
        className={
          inverted
            ? 'font-display text-sm uppercase tracking-[0.2em] text-accent'
            : 'font-display text-sm uppercase tracking-[0.2em] text-primary'
        }
      >
        {title}
      </h2>
      <ol
        className={
          inverted
            ? 'mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-white/85'
            : 'mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground'
        }
      >
        {points.map((point, i) => (
          <li key={i}>{point}</li>
        ))}
      </ol>
    </aside>
  );
}
