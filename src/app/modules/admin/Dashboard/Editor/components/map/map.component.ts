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
import {Observable} from 'rxjs';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {

    map = new LLMap();
    lfgMarker = L.featureGroup();

    @ViewChild('map') mapRef: ElementRef;
    @Input() position$: Observable<LatLng>;
    @Output() position = new EventEmitter<LatLng>();
    constructor() {
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

    click(e: LeafletMouseEvent): void {
        this.renderPoint(this.createMarker(e.latlng));
        this.position.next(e.latlng);
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
    }

}
