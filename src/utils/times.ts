import { fromUnixTime } from 'date-fns';
import format from 'date-fns/format';

export const isPast = (linuxTimestamp: number) => {
  return linuxTimestamp * 1000 < Date.now();
};

export const formatDate = (date: Date, formatter?: string) => {
  return format(date, formatter || 'MMM dd yyyy HH:mm:ss');
};

export const delay = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

export const unixToDate = (unix: number, formatter = 'yyyy-MM-dd'): string => {
  return format(fromUnixTime(unix), formatter);
};
