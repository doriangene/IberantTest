export function isNullOrWhiteSpaces(str: string): boolean {
    return str == null || (/^\s*$/).test(str);
}

export function replaceAll(str: string, from: string, to: string) {
    return str.split(from).join(to);
}

export function trimEnd(str: string, char: string) {
    return str.replace( new RegExp(`${char}+$`), '');
}

export function formatCurrency(n: number, millards?: boolean, currencySimbol: string = '') {
    const s = n.toLocaleString('en', { minimumFractionDigits: 2 });
    if (millards) {
        return `${currencySimbol}${s}K`;
    } else {
        return `${currencySimbol}${s}`;
    }
}

export function truncate(txt: string, length: number): string {
    return txt.length > length ? txt.substr(0, length - 1) + ' ...' : txt;
}

export function union<T>(left: T[], right: T[], comparer: (x: T, y: T) => boolean): T[] {
    return left.concat(right.filter((r) => left.findIndex((l) => comparer(l, r)) === -1));
}

export function difference<T>(left: T[], right: T[], comparer: (x: T, y: T) => boolean): T[] {
    return left.filter((l) => right.findIndex((r) => comparer(l, r)) === -1);
}

export function intersection<T>(left: T[], right: T[], comparer: (x: T, y: T) => boolean): T[] {
    return left.filter((l) => right.findIndex((r) => comparer(l, r)) !== -1);
}

export function swap(arr: any[], i: number, j: number): void {
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

export function humanFileSize(bytes: number, si = true) {
    const thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    const units = si
        ? ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
}

export function reloadPage() {
    window.location.reload(true);
}
