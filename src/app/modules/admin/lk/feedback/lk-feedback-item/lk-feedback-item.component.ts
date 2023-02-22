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
    wrapMode = false;

    @Input()
    public feedback: FeedbackResponse;
    wrap() {
        this.wrapMode = true;
    }
    unwrap() {
        this.wrapMode = false;
    }

    // rejectOrder(order: Order): Promise<any> {}
    // removeOrder(order: Order): Promise<any> {}
    // rejectOrder(order: Order): Promise<any> {}
    // rejectOrder(order: Order): Promise<any> {}
}
