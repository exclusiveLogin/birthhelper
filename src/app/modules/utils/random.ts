export function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

export function randomColor(): string {
    return `rgb(${getRandomArbitrary(0, 255)}, ${getRandomArbitrary(
        0,
        255
    )}, ${getRandomArbitrary(0, 255)})`;
}
