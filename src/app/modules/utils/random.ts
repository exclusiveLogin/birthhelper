import ColorHash from 'color-hash';

export function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

export function randomColor(minFracture = 0, maxFracture = 255): string {
    return `rgb(
    ${getRandomArbitrary(
        minFracture,
        maxFracture
    )},
    ${getRandomArbitrary(
        minFracture, 
        maxFracture
    )}, 
    ${getRandomArbitrary(
        minFracture,
        maxFracture
    )})`;
}

export function getColorFromAny(data: any, lightness = 0.5, saturation = 0.6): string {
    const ch = new ColorHash({lightness, saturation});
    return ch.hex(JSON.stringify(data));
}