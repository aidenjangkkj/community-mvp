import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';

export const formatTimestamp = (timestamp?: Timestamp | null): string => {
  const date = timestamp?.toDate();
  return date ? format(date, 'yyyy-MM-dd HH:mm') : '';
};

export default formatTimestamp;
