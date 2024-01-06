import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

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
    constructor(private sanitazer: DomSanitizer) {}

    get skypeLink(): SafeUrl {
        return this.skype
            ? this.sanitazer.bypassSecurityTrustUrl(
                  "skype:" + this.skype + "/call"
              )
            : null;
    }
}
