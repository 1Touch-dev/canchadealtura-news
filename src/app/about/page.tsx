import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Sobre',
  description: `Conheça ${siteConfig.siteName}`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl text-secondary">Sobre {siteConfig.siteName}</h1>
      <p className="mt-2 text-lg text-muted">{siteConfig.tagline}</p>
      <div className="mt-8 space-y-4 font-article text-base leading-relaxed text-foreground">
        <p>{siteConfig.description}</p>
        <p>
          Somos um portal de notícias comprometido com informação precisa, imparcial e
          atualizada. Nossa equipe editorial cobre esportes, política, economia, cultura,
          tecnologia e saúde com profundidade e agilidade.
        </p>
        <p>
          Este site é gerado a partir do template Brazil CMS e pode ser personalizado
          com design tokens, layouts e variantes de componentes durante a montagem do site.
        </p>
      </div>
    </div>
  );
}
