/** Mirrors backend/src/config/placeholderRegistry.ts — keep names identical. */

export const PLACEHOLDER_PREFIX = 'TODO_';

export function isPlaceholder(value?: string | null): boolean {
  if (!value || !value.trim()) return true;
  return value.trim().toUpperCase().startsWith(PLACEHOLDER_PREFIX);
}

export const TODO = {
  FOOTBALL_LIVE: 'TODO_FOOTBALL_LIVE',
  FOOTBALL_FIXTURES: 'TODO_FOOTBALL_FIXTURES',
  FOOTBALL_STANDINGS: 'TODO_FOOTBALL_STANDINGS',
  FOOTBALL_SCORERS: 'TODO_FOOTBALL_SCORERS',
  FOOTBALL_TEAMS: 'TODO_FOOTBALL_TEAMS',
  FOOTBALL_LEAGUES: 'TODO_FOOTBALL_LEAGUES',
  MARKETS: 'TODO_MARKETS_API',
} as const;
