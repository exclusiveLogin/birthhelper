import * as L from 'leaflet';
import {icon, marker} from 'leaflet';
import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {merge, Subject} from 'rxjs';
import {shareReplay, switchMap, tap} from 'rxjs/operators';
import {DataProviderService, EntityType} from 'app/services/data-provider.service';
import {LLMap} from 'app/modules/map.lib';
import {LatLng} from 'leaflet';
import {Clinic, IClinicMini} from 'app/models/clinic.interface';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit {

    sectionKey: EntityType = 'clinic';

    onInit$ = new Subject<null>();
    onFilterChange$ = new Subject<null>();
    onPageChange$ = new Subject<null>();

    mainSet$ = this.onInit$.pipe(
        switchMap(() => this.setProvider$()),
    );

    mainList$ = merge(this.onInit$, this.onFilterChange$, this.onPageChange$).pipe(
        tap(() => console.log('onInit$')),
        switchMap(() => this.dataProvider$(this.currentPage)),
        shareReplay(1),
    );

    filterList$ = merge(this.onInit$).pipe(
        tap((list) => console.log('filterList$', list)),
        switchMap(() => this.filterProvider$()),
        shareReplay(1),
    );

    dataProvider$ = this.provider.getListProvider(this.sectionKey);
    setProvider$ = this.provider.getSetProvider(this.sectionKey);
    filterProvider$ = this.provider.getFilterProvider(this.sectionKey);

    mode: 'map' | 'list' = 'list';

    private map = new LLMap();

    private lfgClinics = L.featureGroup();

    currentPage = 1;

    constructor(
        private provider: DataProviderService,
        private cdr: ChangeDetectorRef,
    ) {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.onInit$.next(null);
    }

    pageChange(page = 1): void {
        this.currentPage = page;
        this.onPageChange$.next(null);
    }

    modeMap(fitlock = false): void {
        this.mode = 'map';
        this.cdr.detectChanges();
        if (!this.map.isExist()) {
            this.map
                .buildNormal('search_map').map.setView(new LatLng(55.749724, 37.619247), 12);
            this.lfgClinics.addTo(this.map.map);
        }
        this.mainList$.subscribe(list => this.renderPoints(list as IClinicMini[], fitlock));
    }

    modeMapSingle(target: IClinicMini): void {
        this.modeMap(true);
        this.map.map.setView({lat: target.lat, lng: target.lon}, 14);
    }

    modeList(): void {
        this.mode = 'list';
        this.lfgClinics.clearLayers();
        this.map.destroy();
    }

    selectClinicMapHandler(event: MouseEvent): void {
        const selected = event.target['entity'];
        this.searchClinicFromList(selected);
    }

    searchClinicFromList(target: IClinicMini): void {
        const el = document.getElementById('clinic_' + target.id);
        if (el) {
            el.scrollIntoView({behavior: 'smooth', block: 'center'});
            const card = el.querySelector('.card');
            if (card) {
                card.classList.add('selected');
                setTimeout(() => card.classList.remove('selected'), 1200);
            }
        }
    }

    private renderPoints(points: IClinicMini[], fitlock): void {
        this.lfgClinics.clearLayers();

        points.forEach(unit => {
            const clinic = marker([unit.lat, unit.lon], {
                icon: icon({
                    iconUrl: 'img/icons/hospital.png',
                    iconSize: [32, 32],
                    iconAnchor: [16, 16],
                }),
            });
            clinic['entity'] = unit;
            clinic.on('click', this.selectClinicMapHandler.bind(this));

            this.lfgClinics.addLayer(clinic);
        });

        if (!fitlock) {
            this.map.fitByBounds(this.lfgClinics.getBounds());
        }
    }
}
