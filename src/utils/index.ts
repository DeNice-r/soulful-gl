import { MAX_TITLE_LENGTH } from '~/utils/constants';

export function logWithDivider(...args: unknown[]) {
    console.log(...args);
    console.log('-'.repeat(50));
}

export function truncateString(
    str: string,
    length: number = MAX_TITLE_LENGTH,
): string {
    return str.length > length ? str.substring(0, length) + '…' : str;
}
