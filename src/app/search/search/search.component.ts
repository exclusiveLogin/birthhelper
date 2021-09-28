import * as L from 'leaflet';
import {icon, marker} from 'leaflet';
import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {merge, Subject, combineLatest, of, timer, asyncScheduler} from 'rxjs';
import {
    shareReplay,
    switchMap,
    tap,
    map,
    distinctUntilChanged,
    catchError,
    throttleTime,
    retryWhen,
    delayWhen,
} from 'rxjs/operators';
import {DataProviderService, SectionType} from 'app/services/data-provider.service';
import {LLMap} from 'app/modules/map.lib';
import {LatLng} from 'leaflet';
import {IClinicMini} from 'app/models/clinic.interface';
import {FilterResult} from './components/filter/filter.component';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit {

    sectionKey: SectionType = 'clinic';
    hash: string = null;

    onPageChange$ = new Subject<null>();
    onFilters$ = new Subject<FilterResult>();

    onHashByFilters$ = this.onFilters$.pipe(
        switchMap(filters => filters ? this.provider.getFilterHash(this.sectionKey, filters) : of(null)),
        tap((h) => {
            console.log('onHashByFilters$', h);
            this.router.navigate([], {queryParams: {hash: h}}).then();
        })
    );

    onHashByRoute$ = this.ar.queryParamMap.pipe(
        distinctUntilChanged(),
        map(qp => qp.get('hash')));

    onHashError$ = new Subject<null>();
    onHash$ = merge(this.onHashByFilters$, this.onHashByRoute$).pipe(
        tap((hash) => console.log('onHash$: ', hash)),
        tap(hash => this.hash = hash),
        shareReplay(1),
    );

    mainSet$ = this.onHash$.pipe(
        switchMap(() => this.setProvider$(this.hash)),
        tap((result) => console.log('mainSet$', result)),
        catchError((err) => {
            console.error('mainSet$', err);
            this.onHashError$.next(null);
            return of(null);
        }),
        shareReplay(1),
    );

    mainList$ = merge(this.onHash$, this.onPageChange$).pipe(
        switchMap(() => this.dataProvider$(this.currentPage, this.hash)),
        retryWhen(errors => errors.pipe(
            tap(() => this.onHashError$.next(null)),
            delayWhen(() => timer(1000)),
        )),
        shareReplay(1),
    );

    dataProvider$ = this.provider.getListProvider(this.sectionKey);
    setProvider$ = this.provider.getSetProvider(this.sectionKey);
    filterProvider$ = this.provider.getFilterProvider(this.sectionKey);
    filterConfigProvider$ = this.provider.getFilterConfigProvider(this.sectionKey);
    filterList$ = this.filterProvider$().pipe(
        switchMap((filters) =>
            combineLatest([
                of(filters),
                this.filterConfigProvider$(this.hash),
            ]),
        ),
        retryWhen(errors => errors.pipe(
            tap(() => this.onHashError$.next(null)),
            delayWhen(() => timer(1000)),
        )),
        map(([filters, config]) => {
            if (!config) {
                return filters;
            }
            filters.forEach(f => {
                const targetConf = config[f.key];
                if (!targetConf) {
                    return;
                }

                switch (f.type) {
                    case 'flag':
                        const checkedIds = Object.keys(targetConf).map(id => +id);
                        checkedIds.forEach(id => {
                            const t = f.filters.find(ff => ff.id === id);
                            if (t) {
                                t.preInitValue = true;
                            }
                        });
                        break;
                    case 'select':
                        const selectedId = Object.keys(targetConf).map(id => +id)[0];
                        if (selectedId) {
                            f.preInitValue = selectedId;
                        }
                        break;
                }
            });

            return filters;
        }),
    );

    mode: 'map' | 'list' = 'list';

    private map = new LLMap();

    private lfgClinics = L.featureGroup();

    currentPage = 1;

    constructor(
        private provider: DataProviderService,
        private cdr: ChangeDetectorRef,
        private ar: ActivatedRoute,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        this.onHashError$.pipe(
            throttleTime(500, asyncScheduler, {leading: true, trailing: false}),
            tap(() => this.router.navigate([], {queryParams: {hash: null}}).then())
        ).subscribe();
    }

    ngAfterViewInit(): void {
    }

    pageChange(page = 1): void {
        this.currentPage = page;
        this.onPageChange$.next(null);
    }

    selectFilters(filters: FilterResult): void {
        this.onFilters$.next(filters);
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

        if (!fitlock && this.map.isExist()) {
            this.map.fitByBounds(this.lfgClinics.getBounds());
        }
    }
}
