import { format as dateFormat } from 'date-fns';

export function formatDate(
  date: string,
  format = "iiii, dd MMMM RRRR 'at' kk:mm:ss",
): string {
  return dateFormat(new Date(date), format);
}
