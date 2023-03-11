import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-lk-feedback-massage",
    templateUrl: "./lk-feedback-message.component.html",
    styleUrls: ["./lk-feedback-message.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LkFeedbackMessageComponent {
    @Input() text: string;
    @Input() mode: "main" | "answer" | "reply";
    @Input() color: "primary" | "accent" | "secondary-accent";
    constructor() {}
}
