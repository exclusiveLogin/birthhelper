import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from "@angular/core";
import { CTG, LkService } from "@services/lk.service";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { Contragent } from "@models/contragent.interface";
import { map, shareReplay, switchMap, tap } from "rxjs/operators";
import { OrderGroup } from "@models/order.interface";
import { User, UserSrc } from "@models/user.interface";
import { RestService } from "@services/rest.service";
import { FeedbackService } from "@modules/feedback/feedback.service";
import { FeedbackResponse } from "@modules/feedback/models";

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
        map((filters) => ({
            contragentId: this.ctg.entId,
            status: filters.status,
            section: filters.section_key,
            // skip: this.skip,
        }))
    );

    onFeedbackList$ = combineLatest([this.updater$, this.onRequest$]).pipe(
        tap((_) => console.log("onFeedbackList$", _)),
        map(([_, data]) => data),
        // tap((data) => (data.skip = this.skip)),
        switchMap((request) =>
            this.feedbackService.getFeedbackListByContragent(
                request.contragentId,
                request.section,
                request.status
            )
        ),
        tap((_) => (this.isLoading = false)),
        tap((_) => console.log("onFeedbackList$", _)),
        shareReplay(1)
    );
    // onFeedbackTotal$ = this.onOrdersGroups$.pipe(
    //     map((list) => list?.total ?? 0),
    //     tap((total) => this.empty.next(!total))
    // );
    //
    // onOrderGroupPages$ = this.onOrdersTotal$.pipe(
    //     map((_) => (_ ? Math.ceil(_ / 20) || 1 : 1))
    // );

    constructor(
        private lkService: LkService,
        private feedbackService: FeedbackService,
        private restService: RestService
    ) {}

    trackIt(idx: number, fb: FeedbackResponse): number {
        return fb.id;
    }

    pageChange(page = 1): void {
        this.skip = 20 * (page - 1);
        this.isLoading = true;
        this.updater$.next(null);
    }
}
