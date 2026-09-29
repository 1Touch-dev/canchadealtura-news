/**
 * TheSportsDB CMS Proxy client (Brazil CMS).
 * Routes from Postman collection: TheSportsDB CMS Proxy (Brazil CMS).
 *
 * Base: NEXT_PUBLIC_CMS_URL / siteConfig.cms.baseUrl
 * Auth: X-Sportsdb-Proxy-Secret = SPORTSDB_PROXY_INTERNAL_SECRET (server-only)
 */

import { siteConfig } from '@/lib/site-config';

const SPORTSDB_BASE = (
  process.env.NEXT_PUBLIC_CMS_URL ||
  siteConfig.cms.baseUrl ||
  'https://api.labenditaec.com/api'
).replace(/\/$/, '');

export type SportsdbTeam = {
  id: string;
  name: string;
  shortName?: string;
  altName?: string;
  badge?: string;
  logo?: string;
  banner?: string;
  stadium?: string;
  location?: string;
  country?: string;
  league?: string;
  sport?: string;
  formed?: string;
  description?: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
};

export type SportsdbEvent = {
  id: string;
  name: string;
  home: string;
  away: string;
  homeScore?: string;
  awayScore?: string;
  date?: string;
  time?: string;
  league?: string;
  season?: string;
  venue?: string;
  status?: string;
  thumb?: string;
};

export type SportsdbPlayer = {
  id: string;
  name: string;
  position?: string;
  nationality?: string;
  cutout?: string;
  thumb?: string;
  number?: string;
};

export type SportsdbSport = {
  id: string;
  name: string;
  format?: string;
};

function proxySecret(): string | null {
  const secret =
    process.env.SPORTSDB_PROXY_INTERNAL_SECRET ||
    process.env.SPORTSDB_PROXY_SECRET ||
    '';
  return secret.trim() || null;
}

export function hasSportsdbAuth(): boolean {
  return !!proxySecret();
}

function sportsdbUrl(
  path: string,
  query?: Record<string, string | number | undefined>
): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const href = `${SPORTSDB_BASE}${clean}`;
  if (!query) return href;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value == null || value === '') continue;
    params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `${href}?${qs}` : href;
}

async function getSportsdbJson(url: string): Promise<unknown | null> {
  const secret = proxySecret();
  if (!secret) return null;
  try {
    const init: RequestInit & { next?: { revalidate: number } } = {
      headers: {
        Accept: 'application/json',
        'X-Sportsdb-Proxy-Secret': secret,
      },
    };
    if (typeof window === 'undefined') {
      init.next = { revalidate: 60 };
    }
    const res = await fetch(url, init);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : null;
}

function firstArray(...candidates: unknown[]): Record<string, unknown>[] {
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.filter(
        (row): row is Record<string, unknown> => !!row && typeof row === 'object'
      );
    }
  }
  return [];
}

function unwrapTeams(json: unknown): Record<string, unknown>[] {
  const root = asRecord(json);
  if (!root) return firstArray(json);
  return firstArray(
    root.teams,
    root.team,
    root.response,
    root.data,
    asRecord(root.payload)?.teams,
    asRecord(root.result)?.teams
  );
}

function unwrapEvents(json: unknown): Record<string, unknown>[] {
  const root = asRecord(json);
  if (!root) return firstArray(json);
  return firstArray(
    root.events,
    root.event,
    root.schedule,
    root.response,
    root.data,
    asRecord(root.payload)?.events
  );
}

function unwrapPlayers(json: unknown): Record<string, unknown>[] {
  const root = asRecord(json);
  if (!root) return firstArray(json);
  return firstArray(
    root.player,
    root.players,
    root.response,
    root.data,
    asRecord(root.payload)?.player
  );
}

function unwrapSports(json: unknown): Record<string, unknown>[] {
  const root = asRecord(json);
  if (!root) return firstArray(json);
  return firstArray(
    root.sports,
    root.all,
    root.response,
    root.data,
    asRecord(root.payload)?.sports
  );
}

export function mapSportsdbSport(row: Record<string, unknown>): SportsdbSport | null {
  const id = pickString(row, ['idSport', 'id']);
  const name = pickString(row, ['strSport', 'name', 'sport']);
  if (!id || !name) return null;
  return {
    id,
    name,
    format: pickString(row, ['strFormat', 'format']),
  };
}

function pickString(row: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = row[key];
    if (value == null || value === '') continue;
    return String(value);
  }
  return undefined;
}

export function mapSportsdbTeam(row: Record<string, unknown>): SportsdbTeam | null {
  const id = pickString(row, ['idTeam', 'id', 'teamId', 'idAPIfootball']);
  const name = pickString(row, ['strTeam', 'name', 'strTeamShort', 'team']);
  if (!id || !name) return null;
  return {
    id,
    name,
    shortName: pickString(row, ['strTeamShort', 'strTeamAlternate']),
    altName: pickString(row, ['strAlternate', 'strTeamAlternate']),
    badge: pickString(row, ['strBadge', 'strTeamBadge', 'badge']),
    logo: pickString(row, ['strLogo', 'logo', 'strTeamLogo']),
    banner: pickString(row, ['strBanner', 'strFanart1']),
    stadium: pickString(row, ['strStadium', 'stadium']),
    location: pickString(row, ['strLocation', 'strStadiumLocation']),
    country: pickString(row, ['strCountry', 'country']),
    league: pickString(row, ['strLeague', 'league']),
    sport: pickString(row, ['strSport', 'sport']),
    formed: pickString(row, ['intFormedYear', 'formedYear']),
    description: pickString(row, [
      'strDescriptionEN',
      'strDescriptionES',
      'strDescriptionPT',
      'description',
    ]),
    website: pickString(row, ['strWebsite', 'website']),
    facebook: pickString(row, ['strFacebook']),
    twitter: pickString(row, ['strTwitter']),
    instagram: pickString(row, ['strInstagram']),
    youtube: pickString(row, ['strYoutube']),
  };
}

export function mapSportsdbEvent(row: Record<string, unknown>): SportsdbEvent | null {
  const id = pickString(row, ['idEvent', 'id', 'eventId']);
  const home = pickString(row, ['strHomeTeam', 'homeTeam', 'home']);
  const away = pickString(row, ['strAwayTeam', 'awayTeam', 'away']);
  if (!id || (!home && !away)) return null;
  return {
    id,
    name: pickString(row, ['strEvent', 'name']) || `${home || '?'} x ${away || '?'}`,
    home: home || 'A definir',
    away: away || 'A definir',
    homeScore: pickString(row, ['intHomeScore', 'homeScore']),
    awayScore: pickString(row, ['intAwayScore', 'awayScore']),
    date: pickString(row, ['dateEvent', 'date', 'strTimestamp']),
    time: pickString(row, ['strTime', 'strTimeLocal', 'time']),
    league: pickString(row, ['strLeague', 'league']),
    season: pickString(row, ['strSeason', 'season']),
    venue: pickString(row, ['strVenue', 'venue']),
    status: pickString(row, ['strStatus', 'status']),
    thumb: pickString(row, ['strThumb', 'strPoster']),
  };
}

export function mapSportsdbPlayer(row: Record<string, unknown>): SportsdbPlayer | null {
  const id = pickString(row, ['idPlayer', 'id']);
  const name = pickString(row, ['strPlayer', 'name']);
  if (!id || !name) return null;
  return {
    id,
    name,
    position: pickString(row, ['strPosition', 'position']),
    nationality: pickString(row, ['strNationality', 'nationality']),
    cutout: pickString(row, ['strCutout']),
    thumb: pickString(row, ['strThumb', 'strRender']),
    number: pickString(row, ['strNumber', 'number']),
  };
}

/** v1 — GET /sportsdb/search/team?t= */
export async function searchTeamV1(query: string): Promise<SportsdbTeam[]> {
  const q = query.trim();
  if (!q) return [];
  const json = await getSportsdbJson(
    sportsdbUrl('/sportsdb/search/team', { t: q })
  );
  return unwrapTeams(json)
    .map(mapSportsdbTeam)
    .filter((t): t is SportsdbTeam => !!t);
}

/** v2 — GET /sportsdb/v2/search/team/:query */
export async function searchTeamV2(query: string): Promise<SportsdbTeam[]> {
  const q = query.trim();
  if (!q) return [];
  const json = await getSportsdbJson(
    sportsdbUrl(`/sportsdb/v2/search/team/${encodeURIComponent(q)}`)
  );
  return unwrapTeams(json)
    .map(mapSportsdbTeam)
    .filter((t): t is SportsdbTeam => !!t);
}

/** v1 — GET /sportsdb/teams/search?l=&s=&c= */
export async function searchTeamsByLeague(opts: {
  league?: string;
  sport?: string;
  country?: string;
}): Promise<SportsdbTeam[]> {
  const json = await getSportsdbJson(
    sportsdbUrl('/sportsdb/teams/search', {
      l: opts.league,
      s: opts.sport || 'Soccer',
      c: opts.country,
    })
  );
  return unwrapTeams(json)
    .map(mapSportsdbTeam)
    .filter((t): t is SportsdbTeam => !!t);
}

/** v1 — GET /sportsdb/team/:id */
export async function lookupTeamV1(teamId: string): Promise<SportsdbTeam | null> {
  const json = await getSportsdbJson(sportsdbUrl(`/sportsdb/team/${encodeURIComponent(teamId)}`));
  return unwrapTeams(json).map(mapSportsdbTeam).find(Boolean) || null;
}

/** v2 — GET /sportsdb/v2/team/:id */
export async function lookupTeamV2(teamId: string): Promise<SportsdbTeam | null> {
  const json = await getSportsdbJson(
    sportsdbUrl(`/sportsdb/v2/team/${encodeURIComponent(teamId)}`)
  );
  return unwrapTeams(json).map(mapSportsdbTeam).find(Boolean) || null;
}

/** v2 — GET /sportsdb/v2/league/:id/teams */
export async function leagueTeamsV2(leagueId: string): Promise<SportsdbTeam[]> {
  const json = await getSportsdbJson(
    sportsdbUrl(`/sportsdb/v2/league/${encodeURIComponent(leagueId)}/teams`)
  );
  return unwrapTeams(json)
    .map(mapSportsdbTeam)
    .filter((t): t is SportsdbTeam => !!t);
}

export async function teamNext(
  teamId: string,
  version: 'v1' | 'v2' = 'v2'
): Promise<SportsdbEvent[]> {
  const path =
    version === 'v2'
      ? `/sportsdb/v2/team/${encodeURIComponent(teamId)}/next`
      : `/sportsdb/team/${encodeURIComponent(teamId)}/next`;
  const json = await getSportsdbJson(sportsdbUrl(path));
  return unwrapEvents(json)
    .map(mapSportsdbEvent)
    .filter((e): e is SportsdbEvent => !!e);
}

export async function teamPrevious(
  teamId: string,
  version: 'v1' | 'v2' = 'v2'
): Promise<SportsdbEvent[]> {
  const path =
    version === 'v2'
      ? `/sportsdb/v2/team/${encodeURIComponent(teamId)}/previous`
      : `/sportsdb/team/${encodeURIComponent(teamId)}/previous`;
  const json = await getSportsdbJson(sportsdbUrl(path));
  return unwrapEvents(json)
    .map(mapSportsdbEvent)
    .filter((e): e is SportsdbEvent => !!e);
}

export async function teamPlayers(
  teamId: string,
  version: 'v1' | 'v2' = 'v2'
): Promise<SportsdbPlayer[]> {
  const path =
    version === 'v2'
      ? `/sportsdb/v2/team/${encodeURIComponent(teamId)}/players`
      : `/sportsdb/team/${encodeURIComponent(teamId)}/players`;
  const json = await getSportsdbJson(sportsdbUrl(path));
  return unwrapPlayers(json)
    .map(mapSportsdbPlayer)
    .filter((p): p is SportsdbPlayer => !!p);
}

export async function teamEquipment(
  teamId: string,
  version: 'v1' | 'v2' = 'v2'
): Promise<Record<string, unknown>[]> {
  const path =
    version === 'v2'
      ? `/sportsdb/v2/team/${encodeURIComponent(teamId)}/equipment`
      : `/sportsdb/team/${encodeURIComponent(teamId)}/equipment`;
  const json = await getSportsdbJson(sportsdbUrl(path));
  const root = asRecord(json);
  return firstArray(
    root?.equipment,
    root?.response,
    root?.data,
    json
  );
}

/** v2 — GET /sportsdb/v2/team/:id/full-schedule */
export async function teamFullSchedule(teamId: string): Promise<SportsdbEvent[]> {
  const json = await getSportsdbJson(
    sportsdbUrl(`/sportsdb/v2/team/${encodeURIComponent(teamId)}/full-schedule`)
  );
  return unwrapEvents(json)
    .map(mapSportsdbEvent)
    .filter((e): e is SportsdbEvent => !!e);
}

/**
 * Prefer v1 search (query param), then v2 path search.
 * Returns [] when proxy secret is missing or both fail.
 */
export async function searchTeams(query: string): Promise<SportsdbTeam[]> {
  const q = query.trim();
  if (!q || !hasSportsdbAuth()) return [];
  const v1 = await searchTeamV1(q);
  if (v1.length > 0) return v1;
  return searchTeamV2(q);
}

export async function lookupTeam(teamId: string): Promise<SportsdbTeam | null> {
  if (!teamId || !hasSportsdbAuth()) return null;
  const v2 = await lookupTeamV2(teamId);
  if (v2) return v2;
  return lookupTeamV1(teamId);
}

/** v2 — GET /sportsdb/v2/all/sports (Postman: All sports) */
export async function fetchAllSports(): Promise<SportsdbSport[]> {
  if (!hasSportsdbAuth()) return [];
  const json = await getSportsdbJson(sportsdbUrl('/sportsdb/v2/all/sports'));
  return unwrapSports(json)
    .map(mapSportsdbSport)
    .filter((s): s is SportsdbSport => !!s)
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
}

/** v2 — GET /sportsdb/v2/livescore/sport/:sport */
export async function fetchLivescoreBySport(sport: string): Promise<SportsdbEvent[]> {
  if (!sport.trim() || !hasSportsdbAuth()) return [];
  const json = await getSportsdbJson(
    sportsdbUrl(`/sportsdb/v2/livescore/sport/${encodeURIComponent(sport.trim())}`)
  );
  return unwrapEvents(json)
    .map(mapSportsdbEvent)
    .filter((e): e is SportsdbEvent => !!e);
}

export function sportsEventPath(eventId: string): string {
  return `/evento/${eventId}`;
}

/** v1 — GET /sportsdb/event/:id */
export async function lookupEvent(eventId: string): Promise<SportsdbEvent | null> {
  if (!eventId || !hasSportsdbAuth()) return null;
  const json = await getSportsdbJson(
    sportsdbUrl(`/sportsdb/event/${encodeURIComponent(eventId)}`)
  );
  return unwrapEvents(json).map(mapSportsdbEvent).find(Boolean) || null;
}
