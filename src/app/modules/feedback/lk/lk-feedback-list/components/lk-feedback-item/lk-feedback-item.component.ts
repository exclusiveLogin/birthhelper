import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
} from "@angular/core";
import {
    Comment,
    FeedbackResponse,
    StatusRusMap,
    SummaryRateByTargetResponse,
    Vote,
} from "@modules/feedback/models";
import { BehaviorSubject, Observable, Subject, of } from "rxjs";
import { User } from "@models/user.interface";
import { RestService } from "@services/rest.service";
import { Entity } from "@models/entity.interface";
import { FeedbackService } from "@modules/feedback/feedback.service";
import { Reply } from "@modules/admin/lk/common/lk-bubble/lk-bubble.component";
import { AuthService } from "@modules/auth-module/auth.service";
import { repeatWhen, retryWhen, switchMap, take, tap } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-lk-feedback-item",
    templateUrl: "./lk-feedback-item.component.html",
    styleUrls: ["./lk-feedback-item.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LkFeedbackItemComponent implements OnInit {
    constructor(
        private restService: RestService,
        private cdr: ChangeDetectorRef,
        private fbs: FeedbackService,
        private authService: AuthService,
        private toastService: ToastrService
    ) {}
    wrapMode = false;
    user$: Observable<User>;
    loginedUser$: Observable<User>;
    entity$: Observable<Entity>;
    replies$: Observable<Comment[]>;
    rating$: Observable<SummaryRateByTargetResponse>;
    updater$: BehaviorSubject<null> = new BehaviorSubject(null);

    @Input()
    public feedback: FeedbackResponse;
    public replyMode: boolean = false;

    wrap() {
        this.wrapMode = true;
    }
    unwrap() {
        this.wrapMode = false;
    }

    votes: Vote[];

    ngOnInit(): void {
        this.user$ = this.restService.getUserById(this.feedback.user_id);
        this.loginedUser$ = this.authService.getCurrentUser();
        this.votes = this.feedback?.votes;
        this.entity$ = this.restService.getEntity(
            this.feedback.target_entity_key,
            this.feedback.target_entity_id
        );

        if (
            !!this.feedback?.comment?.feedback_id &&
            !!this.feedback?.comment?.id
        ) {
            console.log("LkFeedbackItemComponent: ", this.feedback);
            this.replies$ = this.feedback?.comment?.replies
                ? this.updater$.pipe(
                      switchMap(() =>
                          this.restService.getReplies(this.feedback.comment.id)
                      ),
                      tap((data) => {
                          this.feedback.comment.replies = data.length;
                      })
                  )
                : of(null);
        }

        this.rating$ =
            !!this.feedback.target_entity_key &&
            !!this.feedback.target_entity_id
                ? this.fbs.getRatingForTarget(
                      this.feedback.target_entity_key,
                      this.feedback.target_entity_id
                  )
                : null;

        this.cdr.markForCheck();
    }

    getUserByComment(comment: Comment): Observable<User> {
        return this.restService.getUserById(comment.user_id);
    }

    getStatusTitleForOrder(feedback: FeedbackResponse): string {
        return StatusRusMap[feedback.status] ?? "---";
    }

    async setFeddbackStatusApproved(e: MouseEvent) {
        e?.stopImmediatePropagation();
        const changed = await this.restService
            .changeFeedbackStatus("approved", this.feedback.id)
            .toPromise();
        if (changed) {
            this.feedback.status = "approved";
            this.cdr.markForCheck();
        }
    }
    async setFeedbackStatusDeclined(e: MouseEvent) {
        e?.stopImmediatePropagation();
        const changed = await this.restService
            .changeFeedbackStatus("reject", this.feedback.id)
            .toPromise();
        if (changed) {
            this.feedback.status = "reject";
            this.cdr.markForCheck();
        }
    }

    answerFeedback(e: Reply, comment: Comment): void {
        this.replyMode = false;
        this.fbs
            .sendFeedbackReply(comment.id, e.text, e.isOfficial)
            .then(() => this.toastService.success("Ответ добавлен"))
            .then(() => this.refresh());
    }

    refresh(): void {
        this.updater$.next(null);
    }
}
