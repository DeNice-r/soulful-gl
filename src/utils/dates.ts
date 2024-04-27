import { format } from 'date-fns';

export function defaultFormatDate(date: Date): string {
    return format(date, 'dd.MM.yyyy');
}

export function defaultFormatTime(date: Date): string {
    return format(date, 'HH:mm:ss');
}

export function defaultFormatDt(date: Date): string {
    return defaultFormatDate(date) + ', ' + defaultFormatTime(date);
}
