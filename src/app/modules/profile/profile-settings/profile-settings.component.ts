import { Component, EventEmitter, Input, Output } from "@angular/core";
import { User } from "@models/user.interface";
import { FormControl, FormGroup } from "@angular/forms";
import { IDictItem } from "@modules/admin/dict.service";
import * as moment from "moment";

@Component({
    selector: "app-profile-settings",
    templateUrl: "./profile-settings.component.html",
    styleUrls: ["./profile-settings.component.scss"],
    // encapsulation: ViewEncapsulation.None,
})
export class ProfileSettingsComponent {
    _user: User;
    @Input() set user(user: User) {
        user.client_birthday_datetime = moment(
            user.client_birthday_datetime
        ).format("yyyy-MM-DD");
        this._user = user;

        Object.keys(user)
            .filter((k) => user[k] !== null)
            .forEach((k) => this.formGroup.get(k)?.setValue(user[k]));
    }

    get user() {
        return this._user;
    }

    @Input() statuses: IDictItem[];

    @Output() refresh = new EventEmitter<User>();
    @Output() reject = new EventEmitter<void>();

    constructor() {}

    formGroup = new FormGroup({
        login: new FormControl(),
        first_name: new FormControl(),
        last_name: new FormControl(),
        patronymic: new FormControl(),
        client_birthday_datetime: new FormControl(),
        status_type: new FormControl("null"),
        conception_datetime: new FormControl(),
        multi_pregnant: new FormControl(),
        weight: new FormControl(),
        height: new FormControl(),
        clothes_size: new FormControl(),
        shoes_size: new FormControl(),
        phone: new FormControl(),
        email: new FormControl(),
        skype: new FormControl(),
        ch_phone: new FormControl(),
        ch_viber: new FormControl(),
        ch_whatsapp: new FormControl(),
        ch_telegram: new FormControl(),
        ch_email: new FormControl(),
        ch_skype: new FormControl(),
    });

    submit() {
        // if (this.formGroup.get("client_birthday_datetime").value) {
        //     this.formGroup
        //         .get("client_birthday_datetime")
        //         .setValue(
        //             new Date(
        //                 this.formGroup.get("client_birthday_datetime").value
        //             ).valueOf()
        //         );
        // }
        this.refresh.emit({ ...this.user, ...this.formGroup.value } as User);
    }

    rejectForm(): void {
        this.reject.emit();
    }
}
