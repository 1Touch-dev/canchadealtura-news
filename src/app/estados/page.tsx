import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBrazilianStates } from '@/lib/cms-client';
import { hasCapability } from '@/lib/capabilities';
import { siteConfig } from '@/lib/site-config';

export const metadata = {
  title: 'Estados',
  description: `Cobertura por estado — ${siteConfig.siteName}`,
};

export default async function EstadosPage() {
  if (!hasCapability('states-directory')) notFound();
  const states = await getBrazilianStates();
  const byRegion = states.reduce<Record<string, typeof states>>((acc, s) => {
    (acc[s.region] ||= []).push(s);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Brasil</p>
      <h1 className="mt-2 font-display text-3xl text-secondary md:text-4xl">Estados</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Diretório nacional (27 UFs). Cada página de estado lista matérias remapeadas para demo.
      </p>
      <div className="mt-10 space-y-10">
        {Object.entries(byRegion).map(([region, list]) => (
          <section key={region}>
            <h2 className="font-display text-sm uppercase tracking-[0.18em] text-secondary">
              {region}
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {list.map((state) => (
                <li key={state.uf}>
                  <Link
                    href={`/estados/${state.slug}`}
                    className="block rounded-lg border border-black/10 bg-surface px-3 py-3 text-sm font-medium hover:border-primary hover:text-primary"
                  >
                    <span className="font-mono text-xs text-muted">{state.uf}</span>
                    <span className="mt-0.5 block">{state.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
