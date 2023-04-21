import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    TemplateRef,
    ViewChild,
} from "@angular/core";
import { User } from "@models/user.interface";
import { Reply } from "../lk-bubble/lk-bubble.component";

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
    @Input() opened: boolean;
    @Input() mode: "main" | "answer" | "reply";
    @Input() color: "primary" | "accent" | "secondary-accent";
    @Input() date: string;
    @Input() fromUser: User;
    @Input() replies: number = 0;
    @Input() editMode = false;
    @Input() canOfficial: boolean;
    
    @Output() sendText = new EventEmitter<Reply>();
    @Output() replyTrigger = new EventEmitter<boolean>();

    activeTemplate: TemplateRef<any>;

    reply(text: Reply): void {
        this.sendText.emit(text);
    }

    openDialog(state: boolean): void {
        this.replyTrigger.next(state);
    }

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
