import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-replies",
    templateUrl: "./replies.component.html",
    styleUrls: ["./replies.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepliesComponent {
    @Input() replies: number;
    constructor() {}
}
