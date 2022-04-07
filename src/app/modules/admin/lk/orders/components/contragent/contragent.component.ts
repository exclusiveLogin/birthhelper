import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {CTG, LkService} from '@services/lk.service';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {Contragent} from '@models/contragent.interface';
import {RestService} from '@services/rest.service';
import {ODRER_ACTIONS, Order, OrderGroup, OrderRequest, OrderResponse} from '@models/order.interface';
import {map, shareReplay, switchMap, tap} from 'rxjs/operators';
import {Sections} from '@models/core';
import {SectionType} from '@services/search.service';
import {User, UserSrc} from '@models/user.interface';

@Component({
    selector: 'app-contragent',
    templateUrl: './contragent.component.html',
    styleUrls: ['./contragent.component.scss']
})
export class ContragentComponent implements OnInit {

    public isLoading = true;
    public contragent$: Observable<Contragent>;
    public ctg: CTG;
    public skip = 0;
    @Input()
    private set contragent(value: CTG) {
        if (value?.entId) {
            this.isLoading = true;
            this.ctg = value;
            this.contragent$ = this.restService.getEntity<Contragent>('ent_contragents', value.entId);
        }
    }

    updater$ = new BehaviorSubject(null);
    onRequest$ = this.lkService.ordersFilters$.pipe(
        map((filters) => ({
            action: ODRER_ACTIONS.GET,
            groupMode: filters.group_mode,
            contragent_entity_id: this.ctg.entId,
            status: filters.status,
            section_key: filters.section_key,
            skip: this.skip,
        }) as OrderRequest),
    );

    onOrdersGroups$ = combineLatest([this.updater$, this.onRequest$]).pipe(
        map(([_, data]) => data),
        tap(data => data.skip = this.skip),
        switchMap(request => this.restService.requestOrdersPost<OrderResponse<OrderGroup>>(request)),
        tap(_ => this.isLoading = false),
        shareReplay(1),
    );

    onOrdersGroupResult$ = this.onOrdersGroups$.pipe(
        map(data => data.result),
        tap(grp => grp?.forEach(g => g.orders = g.orders.map(o => new Order(o)))),
        tap(grp => grp?.forEach(g => g.user = new User(g.user as unknown as UserSrc))),
    );

    onOrdersTotal$ = this.onOrdersGroups$.pipe(map(list => list?.total ?? 0 ));

    onOrderGroupPages$ = this.onOrdersTotal$.pipe(map(_ => _ ? Math.ceil(_ / 20) || 1 : 1));

    constructor(
        private restService: RestService,
        private lkService: LkService,
    ) {
    }

    ngOnInit(): void {
    }

    trackIt(idx: number, og: OrderGroup): string {
        return og.group_id;
    }

    getTitleSection(section: SectionType): string {
        return Sections[section];
    }

    pageChange(page = 1): void {
        this.skip = 20 * (page - 1);
        this.isLoading = true;
        this.updater$.next(null);
    }

    // getGroupsBySection(section: SectionType): Observable<OrderGroup[]> {
    //     return this.onOrdersGroups$.pipe(
    //         map(groups => groups.filter(grp => grp.))
    //     );
    // }
}
