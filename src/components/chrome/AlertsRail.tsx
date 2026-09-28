/**
 * Alerts rail — capability: alerts-rail
 */

import Link from 'next/link';
import type { AlertItem } from '@/lib/cms-client';

interface AlertsRailProps {
  alerts: AlertItem[];
}

export default function AlertsRail({ alerts }: AlertsRailProps) {
  if (!alerts?.length) return null;

  return (
    <div className="border-b border-black/10 bg-amber-50/80">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-2 text-sm">
        <span className="shrink-0 rounded bg-amber-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
          Alertas
        </span>
        <ul className="flex min-w-0 flex-1 flex-wrap gap-x-4 gap-y-1 text-secondary">
          {alerts.slice(0, 4).map((alert) => (
            <li key={alert.id} className="min-w-0 truncate">
              {alert.href ? (
                <Link href={alert.href} className="hover:text-primary hover:underline">
                  <span className="font-semibold">{alert.level}:</span> {alert.title}
                </Link>
              ) : (
                <>
                  <span className="font-semibold">{alert.level}:</span> {alert.title}
                </>
              )}
            </li>
          ))}
        </ul>
        <Link
          href="/alertas"
          className="shrink-0 text-xs font-semibold uppercase tracking-wide text-primary hover:underline"
        >
          Ver todos
        </Link>
      </div>
    </div>
  );
}
