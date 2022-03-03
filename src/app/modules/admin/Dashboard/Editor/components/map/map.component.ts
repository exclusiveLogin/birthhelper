import {AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {LLMap} from '@modules/map.lib';
import {icon, LatLng, LeafletMouseEvent, marker} from 'leaflet';
import * as L from 'leaflet';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {

    map = new LLMap();
    lfgMarker = L.featureGroup();

    @ViewChild('map') mapRef: ElementRef;
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
    }

    ngOnDestroy() {
        this.map.destroy();
    }

    click(e: LeafletMouseEvent): void {
        console.log('click', e);
        const _marker = marker(e.latlng, {
            icon: icon({
                iconUrl: 'img/icons/hospital.png',
                iconSize: [32, 32],
                iconAnchor: [16, 16],
            }),
        });
        this.lfgMarker.clearLayers();
        _marker.addTo(this.lfgMarker);
        this.position.next(e.latlng);
    }

}
