import { Component, ElementRef, ViewChild, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest, merge, Observable } from "rxjs";
import { DictService, IDictItem } from "../admin/dict.service";
import { AuthService } from "../auth-module/auth.service";
import { IFileAdditionalData } from "../admin/rest.service";
import { ISettingsParams, RestService } from "@services/rest.service";
import { filter, map, shareReplay, switchMap, take, tap } from "rxjs/operators";
import { User } from "@models/user.interface";
import { ImageService } from "@services/image.service";
import { IImage } from "../admin/Dashboard/Editor/components/image/image.component";
import { ActivatedRoute, Router } from "@angular/router";
import { FriendService } from "@services/friend.service";
import { RoutingService } from "@services/routing.service";

type Mode = "settings" | "friends";

@Component({
    selector: "app-profile",
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
    @ViewChild("file") private fileRef: ElementRef;

    refresh$ = new BehaviorSubject<void>(void 0);
    mode$: Observable<Mode> = this.routingService.routeData$.pipe(
        map((data) => data?.mode)
    );

    user$: Observable<User> = combineLatest([
        this.refresh$,
        this.route.paramMap,
    ]).pipe(
        switchMap(([_, params]) => {
            const selectedId = Number(params.get("id"));
            return selectedId
                ? this.restService.getUserById(selectedId)
                : this.authService.user$.pipe(
                      tap((usr) =>
                          this.router.navigate([usr.id], {
                              relativeTo: this.route,
                          })
                      )
                  );
        }),
        tap((_) => console.log("user data: ", _)),
        shareReplay(1)
    );

    isSelfProfile$ = combineLatest([this.authService.user$, this.user$]).pipe(
        map(([current, profile]) => current.id === profile.id)
    );

    role$ = this.user$.pipe(
        map((user) => user.meta.role),
        shareReplay(1)
    );
    isGuest$ = this.role$.pipe(
        map((role) => role.slug === "guest"),
        shareReplay(1)
    );
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

    constructor(
        private dictService: DictService,
        private authService: AuthService,
        private restService: RestService,
        private imageService: ImageService,
        private route: ActivatedRoute,
        private router: Router,
        private routingService: RoutingService,
        private friendService: FriendService
    ) {}

    ngOnInit(): void {
        console.log("Route:", this.route);
    }

    goto(path: string): void {
        this.router.navigate([path ? path : "./"], { relativeTo: this.route });
    }

    uploadAvatarHandler(): void {
        this.fileRef.nativeElement.click();
    }

    async upload(ev) {
        console.log("Ready to load", ev);
        const file = ev.target.files[0];
        console.log("file", file);
        if (file) {
            const _data: IFileAdditionalData = {
                folder: "/user-images",
            };

            const fileSaveResponce = await this.restService
                .uploadImage(file, _data)
                .toPromise();

            const user = await this.user$.pipe(take(1)).toPromise();

            const userRequestData = {
                ...user,
                photo_id: fileSaveResponce?.file?.id,
            } as User;

            await this.updateUser(userRequestData);
        }
    }

    reject(): void {
        this.authService.updateUser$.next();
    }

    async updateUser(data: Partial<User>) {
        // Object.keys(data).forEach(k => data[k] =  data[k] === null ? 'null' : data[k]);
        const path: ISettingsParams = {
            mode: "api",
            segment: "ent_users",
        };
        await this.restService.postData(path, data).toPromise();
        this.refresh$.next();
    }

    friendState$ = this.user$.pipe(
        tap((user) => console.log("User: ", user)),
        switchMap((user) => this.friendService.checkFriendship(user.id)),
        map((userFriendshipState) =>
            this.friendService.getFinalyFriendState(userFriendshipState)
        ),
        tap((state) => console.log("state: ", state))
    );
}
