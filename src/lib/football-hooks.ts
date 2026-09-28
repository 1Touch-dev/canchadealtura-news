'use client';

import { useEffect, useState } from 'react';
import { loadPublicSiteConfig } from '@/lib/public-config';
import {
  fetchLiveMatches,
  fetchUpcoming,
  toLiveScore,
  type LiveScore,
  type MatchCardModel,
} from '@/lib/football-client';
import { getCompetitions } from '@/lib/competitions';

export function useLiveScores(): {
  scores: LiveScore[];
  matches: MatchCardModel[];
  ready: boolean;
} {
  const [matches, setMatches] = useState<MatchCardModel[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadPublicSiteConfig();
      if (cancelled) return;
      const live = await fetchLiveMatches({ restrictToPack: true });
      let rows = live.slice(0, 10);
      if (rows.length === 0) {
        const primary = getCompetitions()[0];
        rows = primary ? await fetchUpcoming(primary, 6) : [];
      }
      if (!cancelled) {
        setMatches(rows);
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    matches,
    scores: matches.map(toLiveScore),
    ready,
  };
}
