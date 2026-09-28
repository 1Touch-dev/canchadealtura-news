'use client';

import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonRailProps {
  rows?: number;
  className?: string;
  label?: string;
}

/** Loading placeholder for article rails — static when reduced motion. */
export default function SkeletonRail({
  rows = 4,
  className,
  label = 'Carregando…',
}: SkeletonRailProps) {
  const reduced = useReducedMotion();

  return (
    <div
      className={cn(
        'rounded border border-black/10 bg-surface p-4',
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div
        className={cn(
          'mb-3 h-4 w-28 rounded bg-black/10',
          !reduced && 'animate-shimmer'
        )}
      />
      <ul className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <li key={i} className="flex gap-3">
            <div
              className={cn(
                'h-14 w-20 shrink-0 rounded bg-black/10',
                !reduced && 'animate-shimmer'
              )}
            />
            <div className="flex-1 space-y-2 py-1">
              <div
                className={cn(
                  'h-3 w-full rounded bg-black/10',
                  !reduced && 'animate-shimmer'
                )}
              />
              <div
                className={cn(
                  'h-3 w-2/3 rounded bg-black/10',
                  !reduced && 'animate-shimmer'
                )}
              />
            </div>
          </li>
        ))}
      </ul>
      <span className="sr-only">{label}</span>
    </div>
  );
}
