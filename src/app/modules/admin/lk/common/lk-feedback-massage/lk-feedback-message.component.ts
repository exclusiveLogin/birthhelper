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
    selector: "app-lk-feedback-message",
    templateUrl: "./lk-feedback-message.component.html",
    styleUrls: ["./lk-feedback-message.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LkFeedbackMessageComponent implements OnInit {
    @ViewChild("mainTpl", { static: true })
    elMainTemplate: TemplateRef<any>;

    @ViewChild("answerTpl", { static: true })
    elAnswerTemplate: TemplateRef<any>;

    @ViewChild("replyTpl", { static: true })
    elReplyTemplate: TemplateRef<any>;

    @ViewChild("_avatarTpl", { static: true })
    elAvatarTemplate: TemplateRef<any>;

    @ViewChild("_titleTpl", { static: true })
    elTitleTemplate: TemplateRef<any>;

    @ViewChild("_repliesTpl", { static: true })
    elRepliesTemplate: TemplateRef<any>;

    @ViewChild("_bubbleTpl", { static: true })
    elBubbleTemplate: TemplateRef<any>;

    @Input() text: string;
    @Input() opened: boolean;
    @Input() mode: "main" | "answer" | "reply";
    @Input() color: "primary" | "accent" | "secondary-accent";
    @Input() date: string;
    @Input() fromUser: User;
    @Input() replies: number = 0;
    @Input() editMode = false;
    @Input() canOfficial: boolean;
    @Input() canLikes: boolean;
    @Input() isOfficial: boolean;

    // tpls
    @Input() avatarTemplate: TemplateRef<any>;
    @Input() bubbleTemplate: TemplateRef<any>;
    @Input() repliesTemplate: TemplateRef<any>;
    @Input() titleTemplate: TemplateRef<any>;

    @Output() send = new EventEmitter<Reply>();

    activeTemplate: TemplateRef<any>;

    reply(text: Reply): void {
        this.send.emit(text);
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

        this.avatarTemplate = this.elAvatarTemplate;
        this.bubbleTemplate = this.elBubbleTemplate;
        this.repliesTemplate = this.elRepliesTemplate;
        this.titleTemplate = this.elTitleTemplate;
    }
}
