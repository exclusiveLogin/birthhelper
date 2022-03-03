import * as L from 'leaflet';
import {GeoLatLon, GeoMapPosition, GeoMapState} from 'app/modules/map.models';
import {extendedBounds} from 'app/modules/map.helper';

const MAP_COPYRIGHT = '© Birthhelper since 2019';

export enum TilesType { scheme }

export const TILES_URL: { readonly [key in TilesType]: string } = {
    [TilesType.scheme]: 'https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=ioqyVljKKo8WJGvNkdUvcSTcBs75TruAiIkQ2OAaWUZ1p6Z1Mh1VljBSDuh4wfCT',
};

const TILE_OPTIONS = {
    maxZoom: 18,
    minZoom: 3,
    attribution: MAP_COPYRIGHT,
};

const RUSSIA_BOUNDS = {
    west: 30.58593,
    east: 189.66796,
    north: 77.76758,
    south: 38.7,
};

export class LLMap {

    maxZoom = TILE_OPTIONS.maxZoom;
    map: L.Map = null;
    tileLayer: L.TileLayer;
    /** Fixed promised Leaflet once method */
    once: typeof L.Evented.prototype.once = ((type: any, handler: any, context?: any) => this.map.once(
            type, () => Promise.resolve().then(() => handler()), context)
    ) as any;

    /**
     * - Если функция - это следующий на очереди fit
     * - Если null - выполняется fit, но очередь пустая
     * - Если void - никакой fit не выпоняется и очередь пустая
     */
    waitingFit: () => void;

    constructor() {
    }

    build(element: string | HTMLElement, options: L.MapOptions = {}, tileType: TilesType = TilesType.scheme): this {
        options.tap = false;
        this.map = L.map(typeof element === 'string' ? document.getElementById(element) : element, options);
        this.tileLayer = L.tileLayer(TILES_URL[tileType], TILE_OPTIONS).addTo(this.map);
        return this;
    }

    buildNormal(element: string, tileType: TilesType = TilesType.scheme): this {
        return this.build(element, {}, tileType);
    }

    buildMini(element: string, tileType: TilesType = TilesType.scheme): this {
        // maxZoom: 16,
        return this.build(element, {
            zoomControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
        }, tileType);
    }

    buildSimple(element: string, tileType: TilesType = TilesType.scheme): this {
        // maxZoom: 16,
        return this.build(element, {
            tap: false,
            doubleClickZoom: false,
        }, tileType);
    }

    destroy(): void {
        if (this.map === null) {
            return;
        }
        this.map.remove();
        this.map = null;
    }

    isExist(): boolean {
        return !!this.map;
    }

    /**
     * Измененение слоя тайлов
     */
    toggleTile(tileType: TilesType = TilesType.scheme): TilesType {
        tileType = tileType === TilesType.scheme ? TilesType.scheme : TilesType.scheme;
        this.tileLayer.setUrl(TILES_URL[tileType]);
        return tileType;
    }

    /**
     * Умная очередь для fit методов
     *
     * Если на карте часто вызывается fit метод (центрирование или перемещение),
     * то Leaflet может выполнить только самый fit, а последующие отбросить.
     * У Leaflet есть неприятная особенность — он не делает следующее перемещение,
     * пока не выполнится предыдущее, т. е. пока не будет вызвано событие modeend.
     */
    waitPrevFit(currentFit: () => void): void {
        if (this.waitingFit !== void 0) { // если выполняется предыдущий fit
            this.waitingFit = currentFit;
            return;
        }

        this.waitingFit = null;
        this.once('moveend', () => {
            if (this.waitingFit) {
                const fit = this.waitingFit;
                this.waitingFit = void 0;
                this.waitPrevFit(fit);
            } else {
                this.waitingFit = void 0;
            }
        });
        currentFit();
    }

    fitGeoPosition(geoPos: GeoMapPosition): void {
        const latLon: L.LatLngTuple = [geoPos.center.lat, geoPos.center.lon];
        const zoom = geoPos.zoom;
        this.waitPrevFit(() => this.map.setView(latLon, zoom));
    }

    fitByLatLon(geoLatLngObject: GeoLatLon): void {
        const latLon: L.LatLngTuple = [geoLatLngObject.lat, geoLatLngObject.lon];
        this.waitPrevFit(() => this.map.setView(latLon, 16));
    }

    fitByLatLonAnimate(geoLatLngObject: GeoLatLon, animateDuration: number): void {
        const latLon: L.LatLngTuple = [geoLatLngObject.lat, geoLatLngObject.lon];
        this.waitPrevFit(() => this.map.setView(latLon, 16, {
            duration: animateDuration / 1000,
            animate: true,
        }));
    }

    fitByObject(object: L.FeatureGroup | L.Polygon): void {
        this.fitByBounds(object.getBounds());
    }

    fitByBounds(bounds: L.LatLngBoundsExpression): void {
        this.waitPrevFit(() => this.map.fitBounds(bounds));
    }

    get mapState(): GeoMapState {
        const bounds = this.map.getBounds();
        const center = bounds.getCenter();
        return {
            bounds: extendedBounds({
                west: bounds.getWest(),
                east: bounds.getEast(),
                north: bounds.getNorth(),
                south: bounds.getSouth(),
            }),
            zoom: this.map.getZoom(),
            center: {
                lat: center.lat,
                lon: center.lng,
            },
        };
    }

}
