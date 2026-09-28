import { siteConfig } from '@/lib/site-config';

export type PublicSiteConfig = {
  websiteKey: string;
  displayName?: string;
  locale?: string;
  market?: string;
  enableSports?: boolean;
  leagueId?: number | null;
  season?: number | null;
  teamId?: number | null;
  integrations?: Record<string, string>;
};

const TTL_MS = 60_000;
let overlay: PublicSiteConfig | null = null;
let overlayAt = 0;

/** Assembled site-config first; catalog overlay wins on non-empty cells. */
export function getResolvedIntegrations(): Record<string, string | undefined> {
  return { ...siteConfig.integrations, ...(overlay?.integrations || {}) };
}

export async function loadPublicSiteConfig(): Promise<PublicSiteConfig | null> {
  if (overlay && Date.now() - overlayAt < TTL_MS) return overlay;
  const base = (siteConfig.cms.baseUrl || '').replace(/\/$/, '');
  const key = siteConfig.cms.websiteKey;
  if (!base || !key) {
    overlayAt = Date.now();
    return null;
  }
  try {
    const res = await fetch(
      `${base}/public/sites/${encodeURIComponent(key)}/config`,
      { headers: { Accept: 'application/json' } }
    );
    if (!res.ok) {
      overlayAt = Date.now();
      return overlay;
    }
    const json = (await res.json()) as PublicSiteConfig & { success?: boolean };
    overlay = json;
    overlayAt = Date.now();
    return overlay;
  } catch {
    overlayAt = Date.now();
    return overlay;
  }
}
