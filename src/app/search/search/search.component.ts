import {AfterViewInit, Component, OnInit} from '@angular/core';
import {merge, Subject} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {DataProviderService} from 'app/services/data-provider.service';

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

    constructor(
        private provider: DataProviderService,
    ) {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.onInit$.next(null);
    }
}
