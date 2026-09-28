import {
  CompactNewsroomFooter,
  DenseDirectoryFooter,
  EditorialStatementFooter,
  RegionalServiceFooter,
  SportsClubhouseFooter,
} from '@/components/chrome/footers/families';
import { resolveChrome } from '@/lib/chrome';

export default function Footer() {
  const family = resolveChrome().footer.family;
  switch (family) {
    case 'sports-clubhouse':
      return <SportsClubhouseFooter />;
    case 'editorial-statement':
      return <EditorialStatementFooter />;
    case 'regional-service':
      return <RegionalServiceFooter />;
    case 'compact-newsroom':
      return <CompactNewsroomFooter />;
    case 'dense-directory':
    default:
      return <DenseDirectoryFooter />;
  }
}
