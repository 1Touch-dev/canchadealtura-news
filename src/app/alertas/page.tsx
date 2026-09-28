import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAlerts } from '@/lib/cms-client';
import { hasCapability } from '@/lib/capabilities';
import { formatDatePtBr } from '@/lib/utils';
import { siteConfig } from '@/lib/site-config';

export const metadata = {
  title: 'Alertas',
  description: `Alertas e avisos de ${siteConfig.siteName}`,
};

export default async function AlertasPage() {
  if (!hasCapability('alerts-rail')) notFound();
  const alerts = await getAlerts(50);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Alertas</p>
      <h1 className="mt-2 font-display text-3xl text-secondary md:text-4xl">
        Avisos em destaque
      </h1>
      <p className="mt-2 text-sm text-muted">
        Lista demonstrativa — em produção, o CMS alimenta estes alertas por site.
      </p>
      <ul className="mt-8 divide-y divide-black/10 border-y border-black/10">
        {alerts.map((alert) => (
          <li key={alert.id} className="py-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
              {alert.level}
            </p>
            {alert.href ? (
              <Link href={alert.href} className="mt-1 block font-heading text-lg font-semibold hover:text-primary">
                {alert.title}
              </Link>
            ) : (
              <p className="mt-1 font-heading text-lg font-semibold">{alert.title}</p>
            )}
            <p className="mt-1 text-xs text-muted">{formatDatePtBr(alert.publishedAt)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
