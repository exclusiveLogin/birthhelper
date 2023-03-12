import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from "@angular/core";
import { FeedbackResponse, Vote } from "@modules/feedback/models";
import { Observable } from "rxjs";
import { User } from "@models/user.interface";
import { RestService } from "@services/rest.service";

@Component({
    selector: "app-lk-feedback-item",
    templateUrl: "./lk-feedback-item.component.html",
    styleUrls: ["./lk-feedback-item.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LkFeedbackItemComponent implements OnInit {
    constructor(private restService: RestService) {}
    wrapMode = false;
    user$: Observable<User>;

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
        this.votes = this.feedback?.votes;
    }

    // rejectOrder(order: Order): Promise<any> {}
    // removeOrder(order: Order): Promise<any> {}
    // rejectOrder(order: Order): Promise<any> {}
    // rejectOrder(order: Order): Promise<any> {}
}
