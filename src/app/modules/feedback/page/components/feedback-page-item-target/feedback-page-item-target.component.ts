import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    TemplateRef,
    ViewChild,
} from "@angular/core";
import { Entitized } from "@models/entity.interface";
import { User } from "@models/user.interface";
import { AuthService } from "@modules/auth-module/auth.service";
import { FeedbackService } from "@modules/feedback/feedback.service";
import {
    Comment,
    FeedbackResponse,
    FeedbackSummaryVotes,
} from "@modules/feedback/models";
import { RestService } from "@services/rest.service";
import { BehaviorSubject, Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { DialogService } from "@modules/dialog/dialog.service";
import { DialogServiceConfig } from "@modules/dialog/dialog.model";

@Component({
    selector: "app-feedback-page-item-target",
    templateUrl: "./feedback-page-item-target.component.html",
    styleUrls: ["./feedback-page-item-target.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackPageItemTargetComponent {
    @ViewChild("tpl_dialog_feedback_reply", { static: true, read: TemplateRef })
    replyTemplate: TemplateRef<any>;

    @Input() feedback: FeedbackResponse & FeedbackSummaryVotes & Entitized;

    @Output() update = new EventEmitter();
    @Output() delete = new EventEmitter();
    @Output() edit = new EventEmitter();
    @Output() reply = new EventEmitter();
    @Output() removeReply = new EventEmitter();

    updater$ = new BehaviorSubject(null);
    replies$ = this.updater$.pipe(
        switchMap(() => this.restService.getReplies(this.feedback.comment?.id))
    );

    constructor(
        private feedbackService: FeedbackService,
        private restService: RestService,
        private authService: AuthService,
        private dialogService: DialogService
    ) {}

    setLike(feedback_id: number, invert = false): void {
        this.feedbackService
            .sendRateToFeedback(feedback_id, invert)
            .then(async () => {
                console.log("sendRateFeedback", feedback_id, invert);
                this.update.emit();
            })
            .catch((error) => {
                console.log("sendRateFeedback error: ", error);
            });
    }

    userByFeedback(comment: Comment): Observable<User> {
        return this.restService.getUserById(comment.user_id);
    }

    isSelfOwner(user_id: number): boolean {
        return this.authService.isSelfUser(user_id);
    }

    selfDelete(): void {
        this.delete.emit();
        this.updater$.next(null);
    }

    selfEdit(): void {
        this.edit.emit();
        this.updater$.next(null);
    }

    deleteFeedbackReply(feedback: FeedbackResponse, comment: Comment): void {
        this.dialogService
            .showDialogByTemplateKey("prompt", {
                data: {
                    text: "Вы уверены что хотите удалить этот комментарий?",
                    submit: "Удалить",
                    cancel: "Отмена",
                },
            })
            .then(async () => {
                console.log("deleteFeedbackReply", comment);
                await this.feedbackService
                    .deleteFeedbackReply(feedback.id, comment.id)
                    .toPromise();
                this.updater$.next(null);
                this.removeReply.emit();
            })
            .catch((error) => {
                console.log("deleteFeedback error: ", error);
            });
    }

    replyTrackBy(index, reply: Comment) {
        return reply.id;
    }

    openReplyDialog(feedback: FeedbackResponse): void {
        const dialogConfig: Partial<DialogServiceConfig> = {
            data: {
                id: feedback.id,
                feedback,
            },
        };
        this.dialogService
            .showDialogByTemplate(this.replyTemplate, dialogConfig)
            .then((r) => console.log("dialog result: ", r));
    }

    sendFeedbackReply(
        form: Record<string, string>,
        feedback: FeedbackResponse
    ): void {
        console.log("sendFeedbackReply: ", form, feedback);
        this.feedbackService
            .sendFeedbackReply(feedback.comment.id, form.comment, false)
            .then((r) => {
                console.log("add reply result: ", r);
                this.dialogService.closeOpenedDialog("main_app_dialog");
                this.updater$.next(null);
                this.reply.emit();
            })
            .catch((err) => console.log("add reply error:", err));
    }
}
