import { format } from 'date-fns';
import type { Timestamp } from 'firebase/firestore';

export function formatTimestamp(
  timestamp?: Timestamp | Date | null
): string {
  if (!timestamp) return '';
  const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
  return format(date, 'yyyy-MM-dd HH:mm');
}

export default formatTimestamp;
