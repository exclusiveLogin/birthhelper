import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FeedbackResponse } from "@modules/feedback/models";

@Component({
    selector: "app-lk-feedback-item",
    templateUrl: "./lk-feedback-item.component.html",
    styleUrls: ["./lk-feedback-item.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LkFeedbackItemComponent {
    constructor() {}

    @Input()
    public feedback: FeedbackResponse;
}
