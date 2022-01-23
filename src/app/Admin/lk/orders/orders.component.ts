import {Component, OnInit} from '@angular/core';
import {LkService} from '../../../services/lk.service';
import {filter, shareReplay, switchMap, take, tap} from 'rxjs/operators';
import {RestService} from '../../../services/rest.service';
import {Observable, forkJoin, combineLatest} from 'rxjs';
import {Contragent} from '../../../models/contragent.interface';
import {of} from 'rxjs/internal/observable/of';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

    constructor(
        private lkService: LkService,
        private restService: RestService,
    ) {
    }

    selectedContragents$: Observable<Contragent[]> = this.lkService.selectedContragents$.pipe(
        switchMap(c => !!c.length
            ? forkJoin([
                ...c.map(_ => this.restService.getEntity<Contragent>(_.entKey, _.entId))
            ])
            : of([])),
        shareReplay(1),
    );

    ngOnInit(): void {
    }

}
