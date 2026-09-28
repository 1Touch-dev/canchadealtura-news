/**
 * Chrome config helpers for the shell (mirrors design-schema chrome-v1).
 */

import { siteConfig, type ChromeConfig, type HeaderFamily, type FooterFamily } from '@/lib/site-config';

const HEADER_DEFAULTS: Record<HeaderFamily, ChromeConfig['header']> = {
  'broadcast-scoreboard': {
    family: 'broadcast-scoreboard',
    brandPosition: 'left',
    navPosition: 'below-main',
    breakingPosition: 'below-nav',
    searchMode: 'icon',
    stickyMode: 'compact',
    logoScale: 'standard',
    edgeStyle: 'flat',
    motionProfile: 'energetic',
    signatureModule: 'live-score-indicator',
    surface: 'dark',
  },
  'editorial-centered': {
    family: 'editorial-centered',
    brandPosition: 'center',
    navPosition: 'below-main',
    breakingPosition: 'below-nav',
    searchMode: 'icon',
    stickyMode: 'none',
    logoScale: 'masthead',
    edgeStyle: 'flat',
    motionProfile: 'editorial',
    signatureModule: 'edition-date',
    surface: 'light',
  },
  'newsroom-command': {
    family: 'newsroom-command',
    brandPosition: 'split',
    navPosition: 'below-main',
    breakingPosition: 'inside-header',
    searchMode: 'expanded',
    stickyMode: 'full',
    logoScale: 'compact',
    edgeStyle: 'layered',
    motionProfile: 'energetic',
    signatureModule: 'breaking-command-strip',
    surface: 'dark',
  },
  'regional-utility': {
    family: 'regional-utility',
    brandPosition: 'left',
    navPosition: 'below-main',
    breakingPosition: 'below-nav',
    searchMode: 'icon',
    stickyMode: 'nav-only',
    logoScale: 'standard',
    edgeStyle: 'bordered',
    motionProfile: 'minimal',
    signatureModule: 'region-selector',
    surface: 'light',
  },
  'visual-trending': {
    family: 'visual-trending',
    brandPosition: 'left',
    navPosition: 'below-main',
    breakingPosition: 'none',
    searchMode: 'expanded',
    stickyMode: 'compact',
    logoScale: 'standard',
    edgeStyle: 'layered',
    motionProfile: 'energetic',
    signatureModule: 'trending-carousel',
    surface: 'light',
  },
  'business-markets': {
    family: 'business-markets',
    brandPosition: 'left',
    navPosition: 'below-main',
    breakingPosition: 'top',
    searchMode: 'expanded',
    stickyMode: 'full',
    logoScale: 'compact',
    edgeStyle: 'bordered',
    motionProfile: 'minimal',
    signatureModule: 'market-pulse',
    surface: 'light',
  },
};

const FOOTER_DEFAULTS: Record<FooterFamily, ChromeConfig['footer']> = {
  'sports-clubhouse': {
    family: 'sports-clubhouse',
    brandScale: 'large',
    backgroundTreatment: 'solid',
    columnRhythm: 'asymmetric',
    showNewsletter: false,
    showSocialWall: true,
    showPopularTopics: true,
    showAppPromotion: true,
  },
  'editorial-statement': {
    family: 'editorial-statement',
    brandScale: 'large',
    backgroundTreatment: 'tonal',
    columnRhythm: 'stacked',
    showNewsletter: true,
    showSocialWall: false,
    showPopularTopics: false,
    showAppPromotion: false,
  },
  'dense-directory': {
    family: 'dense-directory',
    brandScale: 'medium',
    backgroundTreatment: 'split',
    columnRhythm: 'balanced',
    showNewsletter: true,
    showSocialWall: true,
    showPopularTopics: true,
    showAppPromotion: false,
  },
  'regional-service': {
    family: 'regional-service',
    brandScale: 'medium',
    backgroundTreatment: 'split',
    columnRhythm: 'balanced',
    showNewsletter: true,
    showSocialWall: true,
    showPopularTopics: true,
    showAppPromotion: false,
  },
  'compact-newsroom': {
    family: 'compact-newsroom',
    brandScale: 'small',
    backgroundTreatment: 'solid',
    columnRhythm: 'stacked',
    showNewsletter: false,
    showSocialWall: true,
    showPopularTopics: false,
    showAppPromotion: false,
  },
};

function legacyHeaderFamily(variant?: string): HeaderFamily {
  switch (variant) {
    case 'broadcast-sticky':
      return 'broadcast-scoreboard';
    case 'editorial-minimal':
      return 'editorial-centered';
    case 'regional-standard':
      return 'regional-utility';
    case 'mega-nav':
    case 'compact-utility':
      return 'newsroom-command';
    default:
      return 'editorial-centered';
  }
}

function legacyFooterFamily(variant?: string): FooterFamily {
  switch (variant) {
    case 'dense-columns':
      return 'dense-directory';
    case 'minimal-links':
    case 'community-focused':
      return 'editorial-statement';
    default:
      return 'dense-directory';
  }
}

export function resolveChrome(): ChromeConfig {
  if (siteConfig.chrome?.schemaVersion === 'chrome-v1') {
    const hf = siteConfig.chrome.header.family;
    const ff = siteConfig.chrome.footer.family;
    const headerBase =
      HEADER_DEFAULTS[hf] || HEADER_DEFAULTS['editorial-centered'];
    const footerBase =
      FOOTER_DEFAULTS[ff] || FOOTER_DEFAULTS['dense-directory'];
    return {
      schemaVersion: 'chrome-v1',
      header: { ...headerBase, ...siteConfig.chrome.header },
      footer: { ...footerBase, ...siteConfig.chrome.footer },
    };
  }
  const hf = legacyHeaderFamily(siteConfig.components.header.variant);
  const ff = legacyFooterFamily(siteConfig.components.footer.variant);
  return {
    schemaVersion: 'chrome-v1',
    header: { ...HEADER_DEFAULTS[hf] },
    footer: { ...FOOTER_DEFAULTS[ff] },
  };
}
