import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {CTG, LkService} from '@services/lk.service';
import {Observable} from 'rxjs';
import {Contragent} from '@models/contragent.interface';
import {RestService} from '@services/rest.service';
import {ODRER_ACTIONS, Order, OrderGroup, OrderRequest} from '@models/order.interface';
import {map, switchMap, tap} from 'rxjs/operators';
import {Sections} from '@models/core';
import {SectionType} from '@services/search.service';

@Component({
    selector: 'app-contragent',
    templateUrl: './contragent.component.html',
    styleUrls: ['./contragent.component.scss']
})
export class ContragentComponent implements OnInit {

    public sectionKeys = Object.keys(Sections);
    public contragent$: Observable<Contragent>;
    public orderGroups$: Observable<OrderGroup[]>;
    public ctg: CTG;
    @Input()
    private set contragent(value: CTG) {
        if (value?.entId && value?.entKey) {
            this.ctg = value;
            this.contragent$ = this.restService.getEntity<Contragent>(value.entKey, value.entId);
        }
    }

    onRequest$ = this.lkService.ordersFilters$.pipe(
        tap(data => console.log('onFilters$: ', data)),
        map((filters) => ({
            action: ODRER_ACTIONS.GET,
            groupMode: filters.group_mode,
            contragent_entity_id: this.ctg.entId,
            contragent_entity_key: this.ctg.entKey,
            status: filters.status,
            section_key: filters.section_key,
        }) as OrderRequest),
    );

    onOrdersGroups$ = this.onRequest$.pipe(
        switchMap(request => this.restService.requestOrdersPost<OrderGroup[]>(request)),
        tap(grp => grp?.forEach(g => g.orders = g.orders.map(o => new Order(o)))),
    );

    constructor(
        private restService: RestService,
        private lkService: LkService,
        private cdr: ChangeDetectorRef,
    ) {
    }

    ngOnInit(): void {
    }

    getTitleSection(section: SectionType): string {
        return Sections[section];
    }

    // getGroupsBySection(section: SectionType): Observable<OrderGroup[]> {
    //     return this.onOrdersGroups$.pipe(
    //         map(groups => groups.filter(grp => grp.))
    //     );
    // }
}
