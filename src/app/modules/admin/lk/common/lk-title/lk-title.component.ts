import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-lk-title",
    templateUrl: "./lk-title.component.html",
    styleUrls: ["./lk-title.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LkTitleComponent {
    @Input() title: string;
    @Input() subTitle: string;
    @Input() accentTitle: string;
    constructor() {}
}
