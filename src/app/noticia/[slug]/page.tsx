import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Alias for briefs that request /noticia/[slug] */
export default async function NoticiaAliasPage({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/artigo/${slug}`);
}
