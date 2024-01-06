export function uniq(items: (number | string)[]): string[] {
    const str = items.map((i) => i.toString());
    return [...new Set(str)];
}
