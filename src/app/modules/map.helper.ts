/** Calculating the hypotenuse for 2 point */
import {GeoBounds, GeoLatLon} from 'app/modules/map.models';

export function hypot(x: number, y: number): number {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

export function extendedBounds(bounds: GeoBounds): GeoBounds {
    const latDistance = Math.abs(bounds.north - bounds.south);
    const lonDistance = Math.abs(bounds.east - bounds.west);
    const extBounds: GeoBounds = {
        west: bounds.west - lonDistance,
        east: bounds.east + lonDistance,
        north: bounds.north + latDistance,
        south: bounds.south - latDistance,
    };
    return extBounds;
}

export function boundsContainsLatLon(bounds: GeoBounds, latLon: GeoLatLon): boolean {
    return (
        bounds.north >= latLon.lat && bounds.east >= latLon.lon &&
        bounds.south <= latLon.lat && bounds.west <= latLon.lon
    );
}
