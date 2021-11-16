import md5 from 'md5';

export function hasher(item: any): string {
    return md5(JSON.stringify(item));
}
