'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { resolveChrome } from '@/lib/chrome';
import { cn } from '@/lib/utils';
import {
  articleNavCategories,
  getCompetitions,
  isSportsSite,
  navHrefForSlug,
} from '@/lib/competitions';

/** Category rail - contrast follows chrome.surface */
export default function CategoryNav() {
  const pathname = usePathname();
  const chrome = resolveChrome().header;

  if (chrome.navPosition === 'none' || chrome.navPosition === 'inside-main') {
    return null;
  }

  const dark = chrome.surface === 'dark';

  const linkClass = (active: boolean) =>
    cn(
      'shrink-0 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
      active
        ? 'bg-primary text-white focus-visible:outline-accent'
        : dark
          ? 'text-white/85 hover:bg-white/10 hover:text-white focus-visible:outline-accent'
          : 'text-secondary hover:bg-primary/10 hover:text-primary focus-visible:outline-primary'
    );

  return (
    <nav
      className={cn(
        'border-b',
        dark ? 'border-white/10 bg-[#0B3D2E]' : 'border-black/10 bg-background'
      )}
      aria-label="Categorias"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 scrollbar-hide">
        <Link href="/" className={linkClass(pathname === '/')}>
          Início
        </Link>
        <Link
          href="/news"
          className={linkClass(
            pathname === '/news' || pathname.startsWith('/artigo/')
          )}
        >
          Notícias
        </Link>
        {isSportsSite() ? (
          <>
            <Link
              href="/futebol"
              className={linkClass(
                pathname === '/futebol' || pathname.startsWith('/liga/')
              )}
            >
              Partidas
            </Link>
            {getCompetitions().map((competition) => {
              const href = `/liga/${competition.slug}`;
              return (
                <Link
                  key={competition.slug}
                  href={href}
                  className={linkClass(pathname === href)}
                >
                  {competition.name}
                </Link>
              );
            })}
          </>
        ) : null}
        {articleNavCategories().map((cat) => {
          const href = navHrefForSlug(cat.slug);
          return (
            <Link
              key={cat.slug}
              href={href}
              className={linkClass(pathname === href)}
            >
              {cat.name}
            </Link>
          );
        })}
        <Link
          href="/categories"
          className={cn(linkClass(pathname === '/categories'), 'ml-auto')}
        >
          Categorias
        </Link>
      </div>
    </nav>
  );
}
