export function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

export function randomColor(minFracture = 0, maxFracture = 255): string {
    return `rgb(${getRandomArbitrary(
        minFracture,
        maxFracture
    )}, ${getRandomArbitrary(minFracture, maxFracture)}, ${getRandomArbitrary(
        minFracture,
        maxFracture
    )})`;
}
