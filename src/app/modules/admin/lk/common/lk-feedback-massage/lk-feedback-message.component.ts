import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
    TemplateRef,
    ViewChild,
} from "@angular/core";
import { User } from "@models/user.interface";

@Component({
    selector: "app-lk-feedback-massage",
    templateUrl: "./lk-feedback-message.component.html",
    styleUrls: ["./lk-feedback-message.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LkFeedbackMessageComponent implements OnInit {
    @ViewChild("mainTpl", { static: true }) elMainTemplate: TemplateRef<any>;
    @ViewChild("answerTpl", { static: true })
    elAnswerTemplate: TemplateRef<any>;
    @ViewChild("replyTpl", { static: true }) elReplyTemplate: TemplateRef<any>;
    @Input() text: string;
    @Input() mode: "main" | "answer" | "reply";
    @Input() color: "primary" | "accent" | "secondary-accent";
    @Input() date: string;
    @Input() fromUser: User;
    activeTemplate: TemplateRef<any>;
    constructor() {}

    ngOnInit(): void {
        switch (this.mode) {
            case "main":
                this.activeTemplate = this.elMainTemplate;
                break;
            case "answer":
                this.activeTemplate = this.elAnswerTemplate;
                break;
            case "reply":
                this.activeTemplate = this.elReplyTemplate;
                break;
            default:
                this.activeTemplate = this.elMainTemplate;
        }
    }
}
