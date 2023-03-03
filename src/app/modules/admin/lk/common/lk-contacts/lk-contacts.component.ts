import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-lk-contacts",
    templateUrl: "./lk-contacts.component.html",
    styleUrls: ["./lk-contacts.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LkContactsComponent {
    @Input() phone: string;
    @Input() email: string;
    @Input() skype: string;
    constructor() {}

    hasChanel(key: string): boolean {
        return;
    }
}
