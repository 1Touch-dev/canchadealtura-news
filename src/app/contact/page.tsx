import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Contato',
  description: `Entre em contato com ${siteConfig.siteName}`,
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl text-secondary">Contato</h1>
      <p className="mt-2 text-muted">
        Envie sua mensagem, sugestão de pauta ou denúncia para nossa redação.
      </p>
      <form className="mt-8 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground">
            Nome
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="mt-1 w-full rounded border border-black/20 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="mt-1 w-full rounded border border-black/20 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-foreground">
            Mensagem
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            className="mt-1 w-full rounded border border-black/20 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded bg-primary px-6 py-2.5 text-sm font-bold uppercase text-white hover:opacity-90"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
