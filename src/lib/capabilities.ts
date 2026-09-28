/**
 * Shared capability helpers for the news-portal shell.
 * Prefer siteConfig.capabilities.enabled — never hardcode a brand.
 */

import { siteConfig } from '@/lib/site-config';

export function hasCapability(id: string): boolean {
  const enabled = siteConfig.capabilities?.enabled;
  if (!Array.isArray(enabled) || enabled.length === 0) {
    // Legacy assembled sites without capabilities block — keep core chrome
    return ['breaking-ticker', 'search', 'category-nav'].includes(id);
  }
  return enabled.includes(id);
}

export function capabilityNavLinks(): Array<{ href: string; label: string }> {
  const links: Array<{ href: string; label: string }> = [];
  if (hasCapability('states-directory')) {
    links.push({ href: '/estados', label: 'Estados' });
  }
  if (hasCapability('alerts-rail')) {
    links.push({ href: '/alertas', label: 'Alertas' });
  }
  if (hasCapability('live-scores')) {
    links.push({ href: '/futebol', label: 'Partidas' });
    links.push({ href: '/ao-vivo', label: 'Ao vivo' });
  } else if (hasCapability('live-blog')) {
    links.push({ href: '/ao-vivo/demo-nacional', label: 'Ao vivo' });
  }
  links.push({ href: '/ultimas', label: 'Últimas' });
  if (hasCapability('search')) {
    links.push({ href: '/busca', label: 'Buscar' });
  }
  return links;
}
