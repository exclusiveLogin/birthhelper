import * as L from 'leaflet';
import {icon, LatLng, marker} from 'leaflet';
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {asyncScheduler, combineLatest, merge, Observable, of, Subject, timer} from 'rxjs';
import {catchError, delayWhen, distinctUntilChanged, map, retryWhen, shareReplay, switchMap, tap, throttleTime, } from 'rxjs/operators';
import {SearchService, SectionType} from 'app/services/search.service';
import {LLMap} from 'app/modules/map.lib';
import {IClinicMini} from 'app/models/clinic.interface';
import {FilterResult} from './components/filter/filter.component';
import {ActivatedRoute, Router} from '@angular/router';
import {IConsultationMini} from '@models/consultation.interface';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class SearchComponent implements OnInit, AfterViewInit {

    sectionKey: SectionType = 'clinic';
    hash: string = null;

    onInitSectionType$: Observable<SectionType> = this.ar.data
        .pipe(map(data => data.section as SectionType));

    onPageChange$ = new Subject<null>();
    onFilters$ = new Subject<FilterResult>();

    onHashByFilters$ = combineLatest([this.onFilters$, this.onInitSectionType$]).pipe(
        switchMap(([filters, sectionKey]) => filters ? this.provider.getFilterHash(sectionKey, filters) : of(null)),
        tap((h) => {
            this.router.navigate([], {queryParams: {hash: h}}).then();
        })
    );

    onHashByRoute$ = this.ar.queryParamMap.pipe(
        distinctUntilChanged(),
        map(qp => qp.get('hash')));

    onHashError$ = new Subject<null>();
    onHash$ = merge(this.onHashByFilters$, this.onHashByRoute$).pipe(
        tap(hash => this.hash = hash),
        shareReplay(1),
    );

    dataProvider$ = this.onInitSectionType$.pipe(map(section => this.provider.getListProvider(section)));
    setProvider$ = this.onInitSectionType$.pipe(map(section => this.provider.getSetProvider(section)));
    filterProvider$ = this.onInitSectionType$.pipe(map(section => this.provider.getFilterProvider(section)));
    filterConfigProvider$ = this.onInitSectionType$.pipe(map(section => this.provider.getFilterConfigProvider(section)));

    mainSet$ = this.onHash$.pipe(
        switchMap((hash) => this.setProvider$.pipe(switchMap(provider => provider(hash)))),
        catchError((err) => {
            console.error('mainSet$', err);
            this.onHashError$.next(null);
            return of(null);
        }),
        shareReplay(1),
        tap(_ => console.log('mainSet$', _)),
    );

    mainList$ = merge(this.onHash$, this.onPageChange$).pipe(
        switchMap(() => this.dataProvider$.pipe(switchMap(provider => provider(this.currentPage, this.hash)))),
        retryWhen(errors => errors.pipe(
            tap(_ => console.log('mainList$ ERROR', _)),
            tap(() => this.onHashError$.next(null)),
            delayWhen(() => timer(1000)),
        )),
        shareReplay(1),
    );

    filterList$ = this.filterProvider$.pipe(
        switchMap(provider => provider()),
        switchMap((filters) =>
            combineLatest([
                of(filters),
                this.onHash$.pipe(
                    switchMap(hash =>
                        this.filterConfigProvider$.pipe(map(provider => provider(hash)))),
                ),
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
        private provider: SearchService,
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

    modeMapSingle(target: IClinicMini | IConsultationMini): void {
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

    renderPoints(points: IClinicMini[], fitlock): void {
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
