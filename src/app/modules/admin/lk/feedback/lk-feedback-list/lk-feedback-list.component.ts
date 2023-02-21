import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
} from "@angular/core";
import { CTG, LkService } from "@services/lk.service";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { Contragent } from "@models/contragent.interface";
import { map, shareReplay, switchMap, tap } from "rxjs/operators";
import {
    ODRER_ACTIONS,
    Order,
    OrderGroup,
    OrderRequest,
    OrderResponse,
} from "@models/order.interface";
import { User, UserSrc } from "@models/user.interface";
import { RestService } from "@services/rest.service";

@Component({
    selector: "app-lk-feedback-list",
    templateUrl: "./lk-feedback-list.component.html",
    styleUrls: ["./lk-feedback-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LkFeedbackListComponent {
    public isLoading = true;
    public contragent$: Observable<Contragent>;
    public ctg: CTG;
    public skip = 0;
    @Input()
    private set contragent(value: CTG) {
        if (value?.entId) {
            this.isLoading = true;
            this.ctg = value;
            this.contragent$ = this.restService.getEntity<Contragent>(
                "ent_contragents",
                value.entId
            );
        }
    }

    @Output()
    public loading = new EventEmitter<boolean>();
    @Output()
    public empty = new EventEmitter<boolean>();

    updater$ = new BehaviorSubject(null);
    onRequest$ = this.lkService.feedbackFilters$.pipe(
        map(
            (filters) =>
                ({
                    action: ODRER_ACTIONS.GET,
                    groupMode: filters.group_mode,
                    contragent_entity_id: this.ctg.entId,
                    status: filters.status,
                    section_key: filters.section_key,
                    skip: this.skip,
                } as OrderRequest)
        )
    );

    onOrdersGroups$ = combineLatest([this.updater$, this.onRequest$]).pipe(
        map(([_, data]) => data),
        tap((data) => (data.skip = this.skip)),
        switchMap((request) =>
            this.restService.requestOrdersPost<OrderResponse<OrderGroup>>(
                request
            )
        ),
        tap((_) => (this.isLoading = false)),
        tap((_) => console.log("onOrdersGroups$", _)),
        shareReplay(1)
    );

    onOrdersGroupResult$ = this.onOrdersGroups$.pipe(
        map((data) => data.result),
        tap((grp) =>
            grp?.forEach((g) => (g.orders = g.orders.map((o) => new Order(o))))
        ),
        tap((grp) =>
            grp?.forEach(
                (g) => (g.user = new User(g.user as unknown as UserSrc))
            )
        ),
        tap((_) => this.cdr.markForCheck())
    );

    onOrdersTotal$ = this.onOrdersGroups$.pipe(
        map((list) => list?.total ?? 0),
        tap((total) => this.empty.next(!total))
    );

    onOrderGroupPages$ = this.onOrdersTotal$.pipe(
        map((_) => (_ ? Math.ceil(_ / 20) || 1 : 1))
    );

    constructor(
        private restService: RestService,
        private lkService: LkService,
        private cdr: ChangeDetectorRef
    ) {}

    trackIt(idx: number, og: OrderGroup): string {
        return og.group_id;
    }

    pageChange(page = 1): void {
        this.skip = 20 * (page - 1);
        this.isLoading = true;
        this.updater$.next(null);
    }
}
