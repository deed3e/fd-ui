import { fromUnixTime } from 'date-fns';
import format from 'date-fns/format';
import { differenceInSeconds, differenceInMinutes, differenceInHours, parseISO } from 'date-fns';

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

export function splitDate(date?: Date) {
  if (!date) return '-'
  return date.toString().split('T')[0]
}

export function getTimeDistance(date?: Date){
  if (!date){
    return '-'
  }
  const distance = differenceInSeconds(new Date(), parseISO(date.toString()))
  if(distance < 60){
    return distance + 's ago'
  }else if(distance < 60 * 60){
    return Math.round(distance / 60) + 'm ago'
  }else if(distance < 60 * 60 * 24){
    return Math.round(distance / 60 / 60) + 'h ago'
  }else {
    return date.toString().split('T')[0]
  }
}
