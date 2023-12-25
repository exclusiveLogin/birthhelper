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
import { Observable, of } from "rxjs";
import { User } from "@models/user.interface";
import { RestService } from "@services/rest.service";
import { Entity } from "@models/entity.interface";
import { FeedbackService } from "@modules/feedback/feedback.service";
import { Reply } from "@modules/admin/lk/common/lk-bubble/lk-bubble.component";
import { AuthService } from "@modules/auth-module/auth.service";

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
        private authService: AuthService
        ) {}
    wrapMode = false;
    user$: Observable<User>;
    loginedUser$: Observable<User>;
    entity$: Observable<Entity>;
    replies$: Observable<Comment[]>;
    rating$: Observable<SummaryRateByTargetResponse>;

    @Input()
    public feedback: FeedbackResponse;
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
            console.log('LkFeedbackItemComponent: ', this.feedback);
            this.replies$ = this.feedback?.comment?.replies
                ? this.restService.getReplies(this.feedback.comment.id)
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

    async setFbStatusApproved(e: MouseEvent) {
        e?.stopImmediatePropagation();
        const changed = await this.restService
            .changeFeedbackStatus("approved", this.feedback.id)
            .toPromise();
        if (changed) {
            this.feedback.status = "approved";
            this.cdr.markForCheck();
        }
    }
    async setFbStatusDeclined(e: MouseEvent) {
        e?.stopImmediatePropagation();
        const changed = await this.restService
            .changeFeedbackStatus("reject", this.feedback.id)
            .toPromise();
        if (changed) {
            this.feedback.status = "reject";
            this.cdr.markForCheck();
        }
    }

    openReply(opened: boolean, comment: Comment): void {
        comment.replymode = opened;
    }

    replyFeedback(e: string, comment: Comment): void {

    }

    answerFeedback(e: Reply, comment: Comment): void {
        this.openReply(false, comment);
        this.fbs.sendFeedbackReply(comment.id, e.text, e.isOfficial);
    }
}
