import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';
import { resolveChrome } from '@/lib/chrome';
import { cn } from '@/lib/utils';
import { articleNavCategories, getCompetitions, isSportsSite } from '@/lib/competitions';

const year = () => new Date().getFullYear();

export function SportsClubhouseFooter() {
  const cfg = resolveChrome().footer;
  return (
    <footer className="mt-auto bg-[#0B3D2E] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div
          className={cn(
            'grid gap-10',
            cfg.columnRhythm === 'asymmetric'
              ? 'md:grid-cols-[1.4fr_1fr_1fr]'
              : 'md:grid-cols-3'
          )}
        >
          <div>
            <p className="font-display text-4xl uppercase tracking-wide">
              {siteConfig.siteName}
            </p>
            <p className="mt-2 max-w-md text-sm text-white/70">
              {siteConfig.tagline || siteConfig.description}
            </p>
            {cfg.showAppPromotion ? (
              <Link
                href="/ao-vivo"
                className="mt-4 inline-flex min-h-11 items-center rounded bg-[#E11D48] px-4 text-xs font-bold uppercase"
              >
                Ver placar ao vivo
              </Link>
            ) : null}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent">
              Competições
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              {(isSportsSite()
                ? getCompetitions()
                : [
                    { slug: 'esportes', name: 'Esportes' },
                  ]
              ).map((item) => (
                <li key={item.slug}>
                  <Link
                    href={
                      isSportsSite()
                        ? `/liga/${item.slug}`
                        : `/categoria/${item.slug}`
                    }
                    className="hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent">
              Clubes & seções
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              {articleNavCategories().slice(0, 5).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categoria/${cat.slug}`}
                    className="hover:text-white"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
            {cfg.showSocialWall ? (
              <p className="mt-6 text-xs text-white/50">Siga · compartalhe lances</p>
            ) : null}
          </div>
        </div>
        <p className="mt-10 border-t border-white/20 pt-6 text-xs text-white/60">
          © {year()} {siteConfig.siteName}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

export function EditorialStatementFooter() {
  const cfg = resolveChrome().footer;
  return (
    <footer className="mt-auto border-t border-black/[0.06] bg-[#FAFAF8]">
      <div className="mx-auto max-w-3xl px-4 py-14 text-center">
        <p
          className={cn(
            'font-display tracking-[-0.02em] text-secondary',
            cfg.brandScale === 'large' ? 'text-4xl md:text-5xl' : 'text-3xl'
          )}
        >
          {siteConfig.siteName}
        </p>
        <p className="mx-auto mt-4 max-w-xl font-article text-base italic leading-relaxed text-muted">
          {siteConfig.description}
        </p>
        <nav className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-secondary">
          <Link href="/about" className="hover:text-primary">
            Sobre
          </Link>
          <Link href="/contact" className="hover:text-primary">
            Redação
          </Link>
          <Link href="/news" className="hover:text-primary">
            Arquivo
          </Link>
          {cfg.showNewsletter ? (
            <Link href="/contact" className="hover:text-primary">
              Newsletter
            </Link>
          ) : null}
        </nav>
        <p className="mt-10 text-xs text-muted">
          © {year()} {siteConfig.siteName}
        </p>
      </div>
    </footer>
  );
}

export function DenseDirectoryFooter() {
  const cfg = resolveChrome().footer;
  return (
    <footer className="mt-auto border-t border-black/10 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="font-heading text-sm font-bold uppercase tracking-wide text-secondary">
              {siteConfig.siteName}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted line-clamp-4">
              {siteConfig.description}
            </p>
            {cfg.showNewsletter ? (
              <Link
                href="/contact"
                className="mt-4 inline-flex text-xs font-bold uppercase text-primary hover:underline"
              >
                Assine a newsletter
              </Link>
            ) : null}
          </div>
          {siteConfig.navCategories.slice(0, 3).map((cat) => (
            <div key={cat.slug}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                {cat.name}
              </p>
              <ul className="mt-2 space-y-1 text-xs text-muted">
                <li>
                  <Link
                    href={`/categoria/${cat.slug}`}
                    className="hover:text-foreground"
                  >
                    Ver seção
                  </Link>
                </li>
                <li>
                  <Link href="/ultimas" className="hover:text-foreground">
                    Últimas
                  </Link>
                </li>
              </ul>
            </div>
          ))}
        </div>
        {cfg.showPopularTopics ? (
          <div className="mt-8 flex flex-wrap gap-2 border-t border-black/10 pt-6">
            {siteConfig.navCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                className="rounded-full border border-black/10 px-3 py-1 text-[10px] font-semibold uppercase text-secondary hover:border-primary hover:text-primary"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        ) : null}
        <p className="mt-6 text-[11px] text-muted">
          © {year()} {siteConfig.siteName}
        </p>
      </div>
    </footer>
  );
}

/** Phase 2 — local / municipal service chrome */
export function RegionalServiceFooter() {
  const cfg = resolveChrome().footer;
  return (
    <footer className="mt-auto border-t border-black/10 bg-[#F4F6F8]">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className="font-heading text-lg font-bold text-foreground">
              {siteConfig.siteName}
            </p>
            <p className="mt-2 text-sm text-muted">
              Serviço local · utilidade pública · cobertura da sua região
            </p>
            {cfg.showNewsletter ? (
              <Link
                href="/contact"
                className="mt-4 inline-flex min-h-11 items-center text-xs font-bold uppercase text-primary"
              >
                Alertas da região
              </Link>
            ) : null}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Serviços
            </p>
            <ul className="mt-3 space-y-2 text-sm text-secondary">
              {['Clima', 'Trânsito', 'Saúde', 'Prefeitura'].map((label) => (
                <li key={label}>
                  <Link href="/ultimas" className="hover:text-primary">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Seções
            </p>
            <ul className="mt-3 space-y-2 text-sm text-secondary">
              {siteConfig.navCategories.slice(0, 5).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categoria/${cat.slug}`}
                    className="hover:text-primary"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-black/10 pt-4 text-[11px] text-muted">
          © {year()} {siteConfig.siteName} · Edição regional
        </p>
      </div>
    </footer>
  );
}

/** Phase 2 — dense breaking / command newsroom chrome */
export function CompactNewsroomFooter() {
  const cfg = resolveChrome().footer;
  return (
    <footer className="mt-auto bg-[#121821] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-heading text-sm font-bold uppercase tracking-[0.14em]">
            {siteConfig.siteName}
          </p>
          <p className="mt-1 text-xs text-white/55">Redação · tempo real</p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-wider text-white/80">
          {siteConfig.navCategories.slice(0, 5).map((cat) => (
            <Link
              key={cat.slug}
              href={`/categoria/${cat.slug}`}
              className="hover:text-white"
            >
              {cat.name}
            </Link>
          ))}
          {cfg.showSocialWall ? (
            <Link href="/contact" className="text-accent hover:text-white">
              Contato
            </Link>
          ) : null}
        </nav>
        <p className="text-[11px] text-white/45">
          © {year()} {siteConfig.siteName}
        </p>
      </div>
    </footer>
  );
}
