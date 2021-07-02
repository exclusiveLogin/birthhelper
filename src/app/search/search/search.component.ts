import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {merge, Subject} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {DataProviderService} from 'app/services/data-provider.service';
import {LLMap} from 'app/modules/map.lib';
import {LatLng} from 'leaflet';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit {

    onInit$ = new Subject<null>();
    onFilterChange$ = new Subject<null>();
    onPageChange$ = new Subject<null>();
    mainList$ = merge(this.onInit$, this.onFilterChange$, this.onPageChange$).pipe(
        tap(() => console.log('onInit$')),
        switchMap(() => this.dataProvider$(1))
    );
    dataProvider$ = this.provider.getListProvider('clinics');
    mode: 'map' | 'list' = 'list';
    private map = new LLMap();

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

    modeMap(): void {
        this.mode = 'map';
        this.cdr.detectChanges();
        this.map
            .buildNormal('search_map').map.setView(new LatLng(55.749724, 37.619247), 12);
    }

    modeList(): void {
        this.mode = 'list';
        this.map.destroy();
    }
}
