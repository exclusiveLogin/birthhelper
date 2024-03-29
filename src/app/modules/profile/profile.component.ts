import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Observable } from "rxjs";
import { DictService, IDictItem } from "../admin/dict.service";
import { AuthService } from "../auth-module/auth.service";
import { FormControl, FormGroup } from "@angular/forms";
import { IFileAdditionalData } from "../admin/rest.service";
import { ISettingsParams, RestService } from "../../services/rest.service";
import { filter, map, shareReplay, switchMap, take, tap } from "rxjs/operators";
import { User } from "../../models/user.interface";
import { ImageService } from "../../services/image.service";
import { IImage } from "../admin/Dashboard/Editor/components/image/image.component";

@Component({
    selector: "app-profile",
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
    @ViewChild("file") private fileRef: ElementRef;
    user$: Observable<User> = this.authService.user$.pipe(
        tap((user) => {
            const nonEmptyKeys = Object.keys(user).filter(
                (k) => user[k] !== null
            );
            nonEmptyKeys.forEach((k) =>
                this.formGroup.get(k)?.setValue(user[k])
            );
        }),
        tap((user) => console.log("user Data: ", user)),
        shareReplay(1)
    );
    role$ = this.authService.role$;
    userPhotoData$ = this.user$.pipe(
        filter((user) => !!user.photo_id),
        map((user) => user.photo_id),
        switchMap((userPhotoId) =>
            this.restService.getEntity("ent_images", userPhotoId)
        ),
        map((image) => this.imageService.getImage$(image as IImage))
    );
    userPhoto$ = this.userPhotoData$.pipe(map((d) => d[0]));
    userPhotoSignal$ = this.userPhotoData$.pipe(map((d) => d[1]));
    statuses$: Observable<IDictItem[]> = this.dictService.getDict(
        "dict_user_status_type"
    );
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

    constructor(
        private dictService: DictService,
        private authService: AuthService,
        private restService: RestService,
        private imageService: ImageService
    ) {}

    ngOnInit(): void {}

    uploadAvatarHandler(): void {
        this.fileRef.nativeElement.click();
    }

    upload(ev): void {
        console.log("Ready to load", ev);
        const file = ev.target.files[0];
        console.log("file", file);
        if (file) {
            const _data: IFileAdditionalData = {
                folder: "/user-images",
            };

            this.restService
                .uploadImage(file, _data)
                .pipe(
                    switchMap((data) =>
                        this.user$.pipe(
                            take(1),
                            map(
                                (user) =>
                                    ({
                                        ...user,
                                        photo_id: data?.file?.id,
                                    } as User)
                            )
                        )
                    ),
                    switchMap((user) => this.updateUser(user))
                )
                .subscribe((data) => {
                    this.authService.updateUser$.next();
                });
        }
    }

    reject(): void {
        this.authService.updateUser$.next();
    }
    submit(): void {
        this.user$
            .pipe(
                take(1),
                map((user) => ({ ...user, ...this.formGroup.value } as User)),
                switchMap((userData) => this.updateUser(userData))
            )
            .subscribe((_) => {
                this.authService.updateUser$.next();
            });
    }
    updateUser(data: Partial<User>): Observable<any> {
        // Object.keys(data).forEach(k => data[k] =  data[k] === null ? 'null' : data[k]);
        const path: ISettingsParams = {
            mode: "api",
            segment: "ent_users",
        };
        return this.restService.postData(path, data);
    }
}
