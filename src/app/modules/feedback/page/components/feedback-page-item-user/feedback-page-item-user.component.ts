import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
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

@Component({
    selector: "app-feedback-page-item-user",
    templateUrl: "./feedback-page-item-user.component.html",
    styleUrls: ["./feedback-page-item-user.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackPageItemUserComponent {
    @Input() feedback: FeedbackResponse & FeedbackSummaryVotes & Entitized;
    @Output() update = new EventEmitter();
    @Output() delete = new EventEmitter();
    @Output() edit = new EventEmitter();

    constructor(private feedbackService: FeedbackService) {}

    setLike(feedback_id: number, invert = false): void {
        this.feedbackService
            .sendRateToFeedback({ id: feedback_id, invert })
            .then(async () => {
                console.log("sendRateFeedback", feedback_id, invert);
                this.update.emit();
            })
            .catch((error) => {
                console.log("sendRateFeedback error: ", error);
            });
    }

    selfDelete(): void {
        this.delete.emit();
    }

    selfEdit(): void {
        this.edit.emit();
    }
}
