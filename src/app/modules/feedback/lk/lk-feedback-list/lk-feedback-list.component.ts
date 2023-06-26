import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from "@angular/core";
import { CTG, LkService } from "@services/lk.service";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { Contragent } from "@models/contragent.interface";
import { map, shareReplay, switchMap, tap } from "rxjs/operators";
import { RestService } from "@services/rest.service";
import { FeedbackService } from "@modules/feedback/feedback.service";
import { FeedbackResponse } from "@modules/feedback/models";

@Component({
    selector: "app-lk-feedback-list",
    templateUrl: "./lk-feedback-list.component.html",
    styleUrls: ["./lk-feedback-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LkFeedbackListComponent implements OnInit{
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
        tap((_) => console.log("onRequest$", _)),
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

    constructor(
        private lkService: LkService,
        private feedbackService: FeedbackService,
        private restService: RestService
    ) {}

    trackIt(_: number, fb: FeedbackResponse): number {
        return fb.id;
    }

    pageChange(page = 1): void {
        this.skip = 20 * (page - 1);
        this.isLoading = true;
        this.updater$.next(null);
    }

    ngOnInit(): void {
        this.updater$.next(null);
    }
}
