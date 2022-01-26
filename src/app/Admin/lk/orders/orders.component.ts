import {Component, OnInit} from '@angular/core';
import {LkService} from '../../../services/lk.service';
import {map, shareReplay, switchMap, tap} from 'rxjs/operators';
import {RestService} from '../../../services/rest.service';
import {combineLatest, forkJoin, NEVER, Observable, of} from 'rxjs';
import {Contragent} from '../../../models/contragent.interface';
import {FormControl, FormGroup} from '@angular/forms';
import {ODRER_ACTIONS, OrderGroup, OrderRequest} from '../../../models/order.interface';

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

    filterForm = new FormGroup({
        group_mode: new FormControl('order'),
        status: new FormControl('inwork'),
        section_key: new FormControl('clinic'),
    });

    selectedContragents$: Observable<Contragent[]> = this.lkService.selectedContragents$.pipe(
        switchMap(c => !!c.length
            ? forkJoin([
                ...c.map(_ => this.restService.getEntity<Contragent>(_.entKey, _.entId))
            ])
            : of([])),
        tap(data => console.log('OrdersComponent selectedContragents$: ', data)),
        shareReplay(1),
    );

    onFilters$ = combineLatest([
        this.lkService.selectedContragents$,
        this.filterForm.valueChanges,
        of(null),
    ]).pipe(
        tap(data => console.log('onFilters$: ', data)),
        map(([ctgs, filters]) => ctgs.map(c => ({
                action: ODRER_ACTIONS.GET,
                groupMode: filters.group_mode,
                contragent_entity_id: c.entId,
                contragent_entity_key: c.entKey,
                status: filters.status,
                section_key: filters.section_key,
            })) as OrderRequest[]),
    );

    onOrders$: Observable<OrderGroup[]> = this.onFilters$.pipe(
        switchMap(setting => !!setting.length
            ? forkJoin(setting.map(s => this.restService.requestOrdersPost(s)))
            : NEVER),
    );

    ngOnInit(): void {
        this.onOrders$.subscribe(data => console.log('OrdersComponent onOrders$', data));
        this.filterForm.valueChanges.subscribe(data => console.log('this.filterForm.valueChanges', data));
        this.filterForm.updateValueAndValidity();
    }

}
