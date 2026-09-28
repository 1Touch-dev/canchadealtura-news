import EmptyState from '@/components/ui/EmptyState';

export default function NotFound() {
  return (
    <EmptyState
      title="Página não encontrada"
      description="O endereço pode ter mudado, ou a matéria ainda não está publicada."
      actionHref="/"
      actionLabel="Voltar ao início"
    />
  );
}
