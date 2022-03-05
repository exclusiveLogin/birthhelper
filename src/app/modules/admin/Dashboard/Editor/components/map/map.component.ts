import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter, Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {LLMap} from '@modules/map.lib';
import * as L from 'leaflet';
import {icon, LatLng, LeafletMouseEvent, Marker, marker} from 'leaflet';
import {Observable, Subject} from 'rxjs';
import {DadataService, IDadataResponse, IDadataSearchData, IDadataSuggestion} from '@services/dadata.service';
import {filter, switchMap, map, debounceTime} from 'rxjs/operators';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {

    map = new LLMap();
    lfgMarker = L.featureGroup();
    addressQuery$ = new Subject<string>();
    addressSuggestions$ = this.addressQuery$.pipe(
        filter(q => !!q && !!q.length),
        debounceTime(1000),
        switchMap(q => this.dadata.getDadataResponseBySearch(q)),
        map(response => response?.suggestions ?? []),
    );

    @ViewChild('map') mapRef: ElementRef;
    @Input() position$: Observable<LatLng>;
    @Output() position = new EventEmitter<LatLng>();

    constructor(
        private dadata: DadataService,
    ) {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit() {
        this.map
            .buildNormal(this.mapRef.nativeElement).map
            .setView(new LatLng(55.749724, 37.619247), 12).on('click', this.click.bind(this));

        this.lfgMarker.addTo(this.map.map);

        if (this.position$) {
            this.position$.subscribe(pos => this.renderPoint(this.createMarker(pos)));
        }
    }

    ngOnDestroy() {
        this.map.destroy();
    }

    searchAddress(query): void {
        this.addressQuery$.next(query);
    }

    selectAddress(suggestion: IDadataSuggestion<IDadataSearchData>): void {
        const lat = suggestion?.data?.geo_lat;
        const lon = suggestion?.data?.geo_lon;
        if (!lat && !lon) { return; }
        const position = new LatLng(+lat, +lon);
        this.selectPosition(position);
    }

    click(e: LeafletMouseEvent): void {
        this.selectPosition(e.latlng);
    }

    selectPosition(position: LatLng): void {
        this.renderPoint(this.createMarker(position));
        this.position.next(position);
    }

    createMarker(position: LatLng): Marker {
        return marker(position, {
            icon: icon({
                iconUrl: 'img/icons/hospital.png',
                iconSize: [32, 32],
                iconAnchor: [16, 16],
            }),
        });
    }

    renderPoint(_marker: Marker): void {
        this.lfgMarker.clearLayers();
        _marker.addTo(this.lfgMarker);
        this.map.fitByBounds(this.lfgMarker.getBounds());
    }

}
