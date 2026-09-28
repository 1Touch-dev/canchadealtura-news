import { redirect } from 'next/navigation';

/** Alias route for briefs that request /ultimas */
export default function UltimasPage() {
  redirect('/news');
}
