import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-lk-confirm-chanel",
    templateUrl: "./lk-confirm-chanel.component.html",
    styleUrls: ["./lk-confirm-chanel.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LkConfirmChanelComponent {
    @Input() phone: boolean;
    @Input() telegram: boolean;
    @Input() viber: boolean;
    @Input() whatsapp: boolean;
    @Input() email: boolean;
    @Input() skype: boolean;

    constructor() {}
}
