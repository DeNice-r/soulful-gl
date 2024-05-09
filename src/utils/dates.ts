import {
    format,
    formatDistance,
    formatDuration,
    intervalToDuration,
} from 'date-fns';
import { uk } from 'date-fns/locale';

export function defaultFormatDate(date: Date): string {
    return format(date, 'dd.MM.yyyy');
}

export function defaultFormatTime(date: Date): string {
    return format(date, 'HH:mm:ss');
}

export function defaultFormatDt(date: Date): string {
    return defaultFormatDate(date) + ', ' + defaultFormatTime(date);
}

export function defaultFormatDiff(diff: number): string {
    return formatDuration(intervalToDuration({ start: 0, end: diff }), {
        locale: uk,
    });
}
