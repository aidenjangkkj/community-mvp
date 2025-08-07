import { format } from 'date-fns';
import type { Timestamp } from 'firebase/firestore';

export function formatTimestamp(
  timestamp?: Timestamp | Date | null
): string {
  if (!timestamp) return '';
  const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
  return format(date, 'yyyy-MM-dd HH:mm');
}
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';

export const formatTimestamp = (timestamp?: Timestamp | null): string => {
  const date = timestamp?.toDate();
  return date ? format(date, 'yyyy-MM-dd HH:mm') : '';
};

export default formatTimestamp;
