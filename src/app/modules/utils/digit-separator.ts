export function digitalPrettier(value: string | number): string {
    if (typeof value === 'undefined' || value === null) { return ''; }
    value = typeof value === 'string' ? parseFloat(value) : value;

    if (!value) { return '0'; }

    return (Math.round((value || 0) * 100) / 100).toString().replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ');
}
