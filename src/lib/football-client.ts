import { siteConfig } from '@/lib/site-config';
import { isPlaceholder } from '@/lib/placeholder-registry';
import { getResolvedIntegrations } from '@/lib/public-config';
import {
  competitionLeagueIds,
  getCompetitions,
  type Competition,
} from '@/lib/competitions';

export type TeamSide = {
  id?: number;
  name: string;
  logo?: string;
};

export type MatchCardModel = {
  id: string;
  home: TeamSide;
  away: TeamSide;
  homeScore: string;
  awayScore: string;
  status: string;
  statusKind: 'live' | 'ft' | 'scheduled' | 'other';
  kickoff?: string;
  venue?: string;
  leagueId?: number;
  leagueName?: string;
};

export type StandingRow = {
  rank: number;
  team: TeamSide;
  played: number;
  goalDiff: number;
  points: number;
};

export type ScorerRow = {
  rank: number;
  name: string;
  team: string;
  teamLogo?: string;
  goals: number;
};

export type LiveScore = {
  id: string;
  label: string;
  home: string;
  away: string;
  homeName: string;
  awayName: string;
  homeLogo?: string;
  awayLogo?: string;
  status: string;
};

const LIVE_SHORT = new Set(['LIVE', '1H', '2H', 'HT', 'ET', 'BT', 'P', 'INT']);
const FT_SHORT = new Set(['FT', 'AET', 'PEN']);

function cmsBase(): string {
  return (siteConfig.cms.baseUrl || '').replace(/\/$/, '');
}

function footballUrl(
  pathOrAbsolute?: string,
  extra?: Record<string, string | number | undefined>
): string | null {
  if (!pathOrAbsolute || isPlaceholder(pathOrAbsolute)) return null;
  let href = pathOrAbsolute;
  if (!/^https?:\/\//i.test(href)) {
    const base = cmsBase();
    if (!base) return null;
    href = `${base}${href.startsWith('/') ? href : `/${href}`}`;
  }
  if (!extra) return href;
  const qIndex = href.indexOf('?');
  const path = qIndex >= 0 ? href.slice(0, qIndex) : href;
  const params = new URLSearchParams(qIndex >= 0 ? href.slice(qIndex + 1) : '');
  for (const [key, value] of Object.entries(extra)) {
    if (value == null || value === '') continue;
    params.set(key, String(value));
  }
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

function unwrapRows(json: unknown): Record<string, unknown>[] {
  if (!json || typeof json !== 'object') return [];
  const root = json as Record<string, unknown>;
  const rows = Array.isArray(root.response)
    ? root.response
    : Array.isArray(root.data)
      ? root.data
      : Array.isArray(json)
        ? json
        : [];
  return rows.filter(
    (row): row is Record<string, unknown> => !!row && typeof row === 'object'
  );
}

function teamFrom(
  node: unknown,
  fallback?: string
): TeamSide {
  const t = (node || {}) as {
    id?: number;
    name?: string;
    logo?: string;
  };
  return {
    id: t.id,
    name: String(t.name || fallback || 'A definir'),
    logo: t.logo,
  };
}

function statusOf(row: Record<string, unknown>): {
  status: string;
  kind: MatchCardModel['statusKind'];
} {
  const fixture = row.fixture as
    | { status?: { short?: string; elapsed?: number; long?: string }; date?: string }
    | undefined;
  const short = String(fixture?.status?.short || row.status || '').toUpperCase();
  const elapsed = fixture?.status?.elapsed;
  if (LIVE_SHORT.has(short)) {
    return {
      status: elapsed ? `${elapsed}'` : 'AO VIVO',
      kind: 'live',
    };
  }
  if (FT_SHORT.has(short) || short === 'AWD') {
    return { status: 'ENCERRADO', kind: 'ft' };
  }
  if (short === 'NS' || short === 'TBD' || !short) {
    return { status: 'AGENDADO', kind: 'scheduled' };
  }
  return { status: short, kind: 'other' };
}

export function mapFixture(row: Record<string, unknown>): MatchCardModel | null {
  const teams = row.teams as
    | { home?: unknown; away?: unknown }
    | undefined;
  const goals = row.goals as { home?: number | null; away?: number | null } | undefined;
  const fixture = row.fixture as
    | {
        id?: number;
        date?: string;
        venue?: { name?: string; city?: string };
      }
    | undefined;
  const league = row.league as { id?: number; name?: string } | undefined;
  const home = teamFrom(teams?.home, String(row.home || ''));
  const away = teamFrom(teams?.away, String(row.away || ''));
  if (!home.name && !away.name) return null;
  const { status, kind } = statusOf(row);
  const id = String(fixture?.id || row.fixtureId || `${home.name}-${away.name}-${fixture?.date || ''}`);
  const venue = [fixture?.venue?.name, fixture?.venue?.city].filter(Boolean).join(' · ');
  const played = kind === 'live' || kind === 'ft';
  return {
    id,
    home,
    away,
    homeScore:
      played && goals?.home != null ? String(goals.home) : '–',
    awayScore:
      played && goals?.away != null ? String(goals.away) : '–',
    status,
    statusKind: kind,
    kickoff: fixture?.date || (typeof row.date === 'string' ? row.date : undefined),
    venue: venue || undefined,
    leagueId: league?.id,
    leagueName: league?.name,
  };
}

export function mapStandings(json: unknown): StandingRow[] {
  const rows = unwrapRows(json);
  const first = rows[0] || {};
  const league = (first.league || first) as {
    standings?: unknown;
  };
  const tables = league.standings;
  const table = Array.isArray(tables)
    ? Array.isArray(tables[0])
      ? tables[0]
      : tables
    : [];
  return (table as Record<string, unknown>[])
    .map((row) => {
      const team = teamFrom(row.team);
      const all = row.all as { played?: number } | undefined;
      return {
        rank: Number(row.rank || row.position || 0),
        team,
        played: Number(all?.played ?? row.played ?? 0),
        goalDiff: Number(row.goalsDiff ?? row.goalDiff ?? 0),
        points: Number(row.points ?? 0),
      };
    })
    .filter((row) => row.team.name && row.rank > 0);
}

export function mapScorers(json: unknown): ScorerRow[] {
  const out: ScorerRow[] = [];
  unwrapRows(json).forEach((row, index) => {
    const player = row.player as { name?: string } | undefined;
    const stats = Array.isArray(row.statistics)
      ? (row.statistics[0] as {
          team?: { name?: string; logo?: string };
          goals?: { total?: number };
        })
      : undefined;
    const name = String(player?.name || '');
    if (!name) return;
    out.push({
      rank: index + 1,
      name,
      team: String(stats?.team?.name || ''),
      teamLogo: stats?.team?.logo,
      goals: Number(stats?.goals?.total ?? row.goals ?? 0),
    });
  });
  return out.slice(0, 10);
}

async function getJson(url: string | null): Promise<unknown | null> {
  if (!url) return null;
  try {
    const init: RequestInit & { next?: { revalidate: number } } = {
      headers: { Accept: 'application/json' },
    };
    if (typeof window === 'undefined') {
      init.next = { revalidate: 45 };
    }
    const res = await fetch(url, init);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function integrations() {
  return {
    ...siteConfig.integrations,
    ...getResolvedIntegrations(),
  };
}

export async function fetchLiveMatches(opts?: {
  restrictToPack?: boolean;
}): Promise<MatchCardModel[]> {
  const url = footballUrl(integrations().FOOTBALL_LIVE);
  const json = await getJson(url);
  const mapped = unwrapRows(json)
    .map(mapFixture)
    .filter((m): m is MatchCardModel => !!m);
  if (opts?.restrictToPack === false) return mapped;
  const ids = new Set(competitionLeagueIds());
  return mapped.filter((m) => m.leagueId != null && ids.has(m.leagueId));
}

export async function fetchUpcoming(competition: Competition, next = 6): Promise<MatchCardModel[]> {
  const extra: Record<string, string | number | undefined> = {
    season: competition.season,
    next,
  };
  if (competition.kind === 'national' && competition.teamId) {
    extra.team = competition.teamId;
  } else {
    extra.league = competition.leagueId;
  }
  const url = footballUrl(integrations().FOOTBALL_FIXTURES, extra);
  const json = await getJson(url);
  return unwrapRows(json)
    .map(mapFixture)
    .filter((m): m is MatchCardModel => !!m)
    .slice(0, next);
}

export async function fetchStandingsFor(competition: Competition): Promise<StandingRow[]> {
  const extra: Record<string, string | number | undefined> = {
    league: competition.leagueId,
    season: competition.season,
  };
  const url = footballUrl(integrations().FOOTBALL_STANDINGS, extra);
  const json = await getJson(url);
  return mapStandings(json);
}

export async function fetchScorersFor(competition: Competition): Promise<ScorerRow[]> {
  const extra: Record<string, string | number | undefined> = {
    league: competition.leagueId,
    season: competition.season,
  };
  const url = footballUrl(integrations().FOOTBALL_SCORERS, extra);
  const json = await getJson(url);
  return mapScorers(json);
}

export async function fetchHubPayload() {
  const competitions = getCompetitions();
  const live = await fetchLiveMatches({ restrictToPack: true });
  const groups = await Promise.all(
    competitions.map(async (competition) => ({
      competition,
      upcoming: await fetchUpcoming(competition, 3),
    }))
  );
  return { live, groups };
}

export function toLiveScore(match: MatchCardModel): LiveScore {
  return {
    id: match.id,
    label: `${match.home.name} x ${match.away.name}`,
    home: match.homeScore,
    away: match.awayScore,
    homeName: match.home.name,
    awayName: match.away.name,
    homeLogo: match.home.logo,
    awayLogo: match.away.logo,
    status: match.status,
  };
}

export function formatKickoff(iso?: string): string {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return '';
  }
}

export function formatKickoffTime(iso?: string): string {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return '';
  }
}
