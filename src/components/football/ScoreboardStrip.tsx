'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useLiveScores } from '@/lib/football-hooks';
import { DURATION, scoreUpdateFlash, transition } from '@/lib/motion';
import MatchCard from '@/components/football/MatchCard';

export default function ScoreboardStrip() {
  const reduced = useReducedMotion();
  const { matches, ready } = useLiveScores();
  if (!ready || matches.length === 0) return null;
  return (
    <section aria-label="Placar">
      <div className="mb-2 flex items-end justify-between">
        <h2 className="font-display text-xl uppercase tracking-wide text-secondary">
          Placar
        </h2>
        <Link
          href={matches.some((m) => m.statusKind === 'live') ? '/ao-vivo' : '/futebol'}
          className="text-xs font-semibold uppercase text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {matches.some((m) => m.statusKind === 'live') ? 'Ver ao vivo' : 'Central de partidas'}
        </Link>
      </div>
      <div className="overflow-x-auto rounded-lg bg-[#0B3D2E] text-white">
        <div className="flex min-w-max divide-x divide-white/10">
          {matches.map((match) => (
            <motion.div
              key={match.id}
              variants={scoreUpdateFlash}
              initial="idle"
              whileHover={reduced ? undefined : 'flash'}
              layout={!reduced}
              transition={transition(DURATION.fast, !!reduced)}
            >
              <MatchCard match={match} variant="compact" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
