import { format } from 'date-fns';
import type { Timestamp } from 'firebase/firestore';

/**
 * Format a Firebase Timestamp or Date to a human-readable string.
 * Update this function to change the timestamp format across the app.
 */
export function formatTimestamp(
  timestamp?: Timestamp | Date | null
): string {
  if (!timestamp) return '';
  const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
  return format(date, 'yyyy-MM-dd HH:mm');
}
