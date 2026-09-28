'use client';

import {
  BroadcastScoreboardHeader,
  BusinessMarketsHeader,
  EditorialCenteredHeader,
  NewsroomCommandHeader,
  RegionalUtilityHeader,
  VisualTrendingHeader,
} from '@/components/chrome/headers/families';
import { resolveChrome } from '@/lib/chrome';

export default function Header() {
  const family = resolveChrome().header.family;
  switch (family) {
    case 'broadcast-scoreboard':
      return <BroadcastScoreboardHeader />;
    case 'newsroom-command':
      return <NewsroomCommandHeader />;
    case 'regional-utility':
      return <RegionalUtilityHeader />;
    case 'visual-trending':
      return <VisualTrendingHeader />;
    case 'business-markets':
      return <BusinessMarketsHeader />;
    case 'editorial-centered':
    default:
      return <EditorialCenteredHeader />;
  }
}

export function HeaderSpacer() {
  return null;
}
