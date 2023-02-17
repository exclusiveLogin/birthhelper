import * as L from "leaflet";

export type GeoBounds = {
    east: number;
    north: number;
    south: number;
    west: number;
};

export type GeoLatLon = {
    lon: number;
    lat: number;
};

export interface GeoLatLonObject extends GeoLatLon {
    id: number;
}

export type GeoMapPosition = {
    zoom: number;
    center: GeoLatLon;
};

export interface GeoMapState extends GeoMapPosition {
    bounds: GeoBounds;
}

export function geoMapInitState(): GeoMapState {
    return {
        zoom: null,
        bounds: {
            east: null,
            north: null,
            south: null,
            west: null,
        },
        center: {
            lon: null,
            lat: null,
        },
    };
}

export type GeoLatLonExpression = GeoLatLon | L.LatLngExpression;

export function toLeafletLatLngLiteral(
    a: GeoLatLonExpression | number,
    b?: number
): L.LatLngLiteral {
    if (typeof a === "object") {
        if ("lon" in a) return { lat: a.lat, lng: a.lon };
        if ("lng" in a) return a;
        if (Array.isArray(a) && a.length > 1) return { lat: a[0], lng: a[1] };
        return null;
    }
    if ((a === 0 || a > 0) && (b === 0 || b > 0)) return { lat: a, lng: b };
    return null;
}

export interface GeoCluster extends GeoLatLon {
    qty: number;
}
