import '../../generated/design-tokens.css';
import './globals.css';
import type { Metadata } from 'next';
import ChromeHost from '@/components/chrome/ChromeHost';
import Footer from '@/components/chrome/Footer';
import { getAlerts, getBreakingHeadlines } from '@/lib/cms-client';
import { siteConfig } from '@/lib/site-config';
import { hasCapability } from '@/lib/capabilities';

export const metadata: Metadata = {
  title: {
    template: `%s | ${siteConfig.siteName}`,
    default: siteConfig.siteName,
  },
  description: siteConfig.description,
  metadataBase: siteConfig.seo.canonicalHost
    ? new URL(siteConfig.seo.canonicalHost)
    : undefined,
  openGraph: {
    title: siteConfig.siteName,
    description: siteConfig.description,
    locale: siteConfig.locale.dialect.replace('-', '_'),
    images: [{ url: siteConfig.seo.defaultOgImage }],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headlines = hasCapability('breaking-ticker')
    ? await getBreakingHeadlines()
    : [];
  const alerts = hasCapability('alerts-rail') ? await getAlerts(4) : [];
  const density = siteConfig.density ?? 'balanced';
  const densityClass =
    density === 'high'
      ? 'density-high'
      : density === 'low'
        ? 'density-low'
        : 'density-balanced';
  const motion = siteConfig.motion ?? 'moderate';
  const motionClass = `motion-${motion}`;

  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        data-layout={siteConfig.layouts.homepage}
        data-density={density}
        data-motion={motion}
        data-header-family={siteConfig.chrome?.header?.family || 'legacy'}
        data-footer-family={siteConfig.chrome?.footer?.family || 'legacy'}
        className={`flex min-h-screen flex-col overflow-x-hidden ${densityClass} ${motionClass}`}
      >
        <a
          href="#conteudo-principal"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:ring"
        >
          Pular para o conteúdo
        </a>
        <ChromeHost headlines={headlines} alerts={alerts} />
        <main id="conteudo-principal" className="flex-1 min-w-0">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
