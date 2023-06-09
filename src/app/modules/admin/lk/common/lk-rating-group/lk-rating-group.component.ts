import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { RateByVote } from "@modules/feedback/models";

@Component({
    selector: "app-lk-rating-group",
    templateUrl: "./lk-rating-group.component.html",
    styleUrls: ["./lk-rating-group.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LkRatingGroupComponent {
    @Input() votes: Partial<RateByVote>[];
    constructor() {}
}
