import { Component, ElementRef, ViewChild, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest, Observable, of, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { DictService, IDictItem } from "../admin/dict.service";
import { AuthService } from "../auth-module/auth.service";
import { IFileAdditionalData } from "../admin/rest.service";
import { ISettingsParams, RestService } from "@services/rest.service";
import {
    catchError,
    map,
    shareReplay,
    switchMap,
    take,
    tap,
} from "rxjs/operators";
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
        map((user) => user?.photo_id),
        switchMap((userPhotoId) =>
            userPhotoId
                ? this.restService.getEntity("ent_images", userPhotoId)
                : of(undefined)
        ),
        map((image) =>
            image
                ? this.imageService.getImage$(image as IImage)
                : of([null, null])
        ),
        catchError(() => of([null, null]))
    );
    userPhoto$ = this.userPhotoData$.pipe(map((d) => d[0]));
    userPhotoSignal$ = this.userPhotoData$.pipe(map((d) => d[1]));
    statuses$: Observable<IDictItem[]> = this.dictService.getDict(
        "dict_user_status_type"
    );

    userSearchQuery = new Subject<string>();
    userFriendSuggestions$: Observable<User[]> = this.userSearchQuery.pipe(
        debounceTime(250),
        distinctUntilChanged(),
        switchMap((q) => this.restService.searchUsers(q))
    );
    isShowSearchUserInput: boolean = false;

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

    hideSearchUserInput() {
        setTimeout(() => (this.isShowSearchUserInput = false), 500);
    }

    showSearchUserInput() {
        setTimeout(() => (this.isShowSearchUserInput = true), 50);
    }

    searchUsers(query: string): void {
        console.log("query:", query);
        this.userSearchQuery.next(query);
    }

    selectUserSuggestion(user: User) {
        console.log("selectUserSuggestion", user);
        this.gotoUserPage(user);
    }

    goto(path: string): void {
        this.router.navigate([path ? path : "./"], { relativeTo: this.route });
    }

    gotoUserPage(user: User) {
        this.router.navigate(["system", "profile", user.id]);
    }

    uploadAvatarHandler(): void {
        this.fileRef.nativeElement.click();
    }

    async sendFriendship() {
        const user = await this.user$.pipe(take(1)).toPromise();
        await this.friendService.sendFriendship(user.id).toPromise();

        this.refresh$.next();
        this.friendService.refresh();
    }

    async blockUser() {
        const user = await this.user$.pipe(take(1)).toPromise();
        await this.friendService.blockUserByUserId(user.id).toPromise();

        this.refresh$.next();
        this.friendService.refresh();
    }

    async unblockUser() {
        const state = await this.userFriendship$.pipe(take(1)).toPromise();
        const blockRecord = state?.blockList?.[0];

        if (!blockRecord) return;

        await this.friendService
            .unblockUserByOfferId(blockRecord.id)
            .toPromise();

        this.refresh$.next();
        this.friendService.refresh();
    }

    async removeFriendship() {
        const state = await this.userFriendship$.pipe(take(1)).toPromise();
        const friendRecord = state?.friendshipList?.[0];

        if (!friendRecord) return;

        await this.friendService.removeFriendship(friendRecord.id).toPromise();

        this.refresh$.next();
        this.friendService.refresh();
    }

    async upload(ev) {
        console.log("Ready to load", ev);
        const file = ev.target.files[0];
        console.log("file", file);
        if (file) {
            const _data: IFileAdditionalData = {
                folder: "/user-images",
            };

            const fileSaveResponse = await this.restService
                .uploadImage(file, _data)
                .toPromise();

            const user = await this.user$.pipe(take(1)).toPromise();

            const userRequestData = {
                ...user,
                photo_id: fileSaveResponse?.file?.id,
            } as User;

            await this.updateUser(userRequestData);
        }
    }

    reject(): void {
        this.authService.updateUser$.next();
    }

    async updateUser(data: Partial<User>) {
        const path: ISettingsParams = {
            mode: "api",
            segment: "ent_users",
        };
        await this.restService.postData(path, data).toPromise();
        this.refresh$.next();
    }

    userFriendship$ = this.user$.pipe(
        switchMap((user) => this.friendService.checkFriendship(user.id)),
        shareReplay(1),
        tap((data) => console.log("user friendship done", data))
    );

    friendState$ = this.userFriendship$.pipe(
        map((userFriendshipState) =>
            this.friendService.getFinalyFriendState(userFriendshipState)
        )
    );

    canSendMessage$ = this.userFriendship$.pipe(
        map((userFriendshipState) =>
            this.friendService.canSendMessage(userFriendshipState)
        )
    );
}
