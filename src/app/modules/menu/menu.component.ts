import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
} from "@angular/core";
import { AuthService } from "../auth-module/auth.service";
import { BehaviorSubject, combineLatest, Observable, of } from "rxjs";
import { User } from "@models/user.interface";
import {
    filter,
    map,
    pluck,
    shareReplay,
    switchMap,
    tap,
} from "rxjs/operators";
import { IImage } from "../admin/Dashboard/Editor/components/image/image.component";
import { RestService } from "@services/rest.service";
import { ImageService } from "@services/image.service";
import { CTG, LkService } from "@services/lk.service";
import {
    Permission,
    PermissionLKType,
    PermissionMap,
    PermissionSetting,
} from "@models/lk.permission.interface";
import { Contragent } from "@models/contragent.interface";
import { randomColor } from "../utils/random";
import { RoutingService } from "@services/routing.service";

type MenuMode = "default" | "lk" | "contragents";

@Component({
    selector: "app-menu",
    templateUrl: "./menu.component.html",
    styleUrls: ["./menu.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
    mql = window.matchMedia("(min-width: 480px)");
    hide = !this.mql.matches;

    @HostBinding("class.menuhide") get host_class() {
        return this.hide;
    }

    // Modes
    mode$: Observable<MenuMode> = this.routingService.routeData$.pipe(
        pluck("main_menu_mode"),
        map((mode) => mode ?? "default"),
        shareReplay(1)
    );

    permissionMode$: Observable<PermissionLKType> =
        this.routingService.routeData$.pipe(
            pluck("permission_mode"),
            tap((data) => console.log("permissionMode$: ", data)),
            shareReplay(1)
        );

    isLKMode$ = this.mode$.pipe(map((mode) => mode === "lk"));
    isContragentsMode$ = this.mode$.pipe(map((mode) => mode === "contragents"));
    isDefaultMode$ = this.mode$.pipe(map((mode) => mode === "default"));

    // Permissions data
    onUserAccess$ = this.authService.onUserAccess$;
    user$: Observable<User> = this.authService.user$.pipe(shareReplay(1));
    userPhotoData$ = this.user$.pipe(
        // filter((user) => !!user.photo_id),
        map((user) => user.photo_id),
        switchMap((userPhotoId) =>
            userPhotoId
                ? this.restService.getEntity("ent_images", userPhotoId)
                : of(null)
        ),
        map((image) =>
            image ? this.imageService.getImage$(image as IImage) : of(null)
        )
    );
    userPhoto$ = this.userPhotoData$.pipe(map((d) => d[0]));
    userPhotoSignal$ = this.userPhotoData$.pipe(map((d) => d[1]));
    permissionsRaw$: Observable<Permission[]> = this.lkService.permissionsRaw$;
    permSections$: Observable<string[]> = this.lkService.permSections$;
    availableContragents$: Observable<CTG[]> = combineLatest([
        this.permissionsRaw$,
        this.permissionMode$,
    ]).pipe(
        map(([permissions, mode]) =>
            permissions
                .filter((p) => p?.meta?.permission_id?.slug === mode)
                .map((p) => ({
                    entId: p.contragent_entity_id,
                    color: this.getRandomColor(),
                }))
        ),
        tap((data) => console.log("availableContragents$: ", data)),
        tap((av) => this.lkService.setAvailableContragents(av)),
        shareReplay(1)
    );
    selectedContragents$ = new BehaviorSubject<CTG[]>([]);
    selectedStateCtgs$ = combineLatest([
        this.availableContragents$,
        this.selectedContragents$,
    ]).pipe(
        map(([av, sel]) =>
            av.every((a) =>
                sel.some((s) => JSON.stringify(s) === JSON.stringify(a))
            )
        )
    );

    constructor(
        public authService: AuthService,
        private restService: RestService,
        private imageService: ImageService,
        private lkService: LkService,
        private routingService: RoutingService,
        private cdr: ChangeDetectorRef
    ) {
        this.selectedContragents$
            .pipe(
                tap((selected) =>
                    this.lkService.setSelectedContragents(selected)
                ),
                tap((data) => console.log("selectedContragents$", data))
            )
            .subscribe();
    }

    menuToggle(): void {
        console.log("menu");
        this.hide = !this.hide;
        this.cdr.detectChanges();
    }

    selectCTG(ctg: CTG): void {
        console.log("selectCTG tick", ctg);
        if (
            this.selectedContragents$.value.some(
                (c) => JSON.stringify(c) === JSON.stringify(ctg)
            )
        ) {
            // REMOVE
            this.selectedContragents$.next([
                ...this.selectedContragents$.value.filter(
                    (c) => JSON.stringify(c) !== JSON.stringify(ctg)
                ),
            ]);
        } else {
            // ADD
            this.selectedContragents$.next([
                ctg,
                ...this.selectedContragents$.value,
            ]);
        }
    }

    selectAll(): void {
        this.availableContragents$
            .pipe(tap((ctgs) => this.selectedContragents$.next(ctgs)))
            .toPromise();
    }

    deselectAll(): void {
        this.selectedContragents$.next([]);
    }

    isSelectedCTG(ctg: CTG): boolean {
        return this.selectedContragents$.value.some(
            (c) => JSON.stringify(c) === JSON.stringify(ctg)
        );
    }

    getUserName(user: User): string {
        return `${user.first_name || ""} ${user.last_name || ""}`;
    }

    getPoint(perm: string): PermissionSetting {
        return PermissionMap[perm];
    }

    getContragent(id: number): Observable<Contragent> {
        return this.restService.getEntity("ent_contragents", id);
    }

    getRandomColor(): string {
        return randomColor();
    }

    trackByIdentity(index: number, item: { entId: number }) {
        return item.entId;
    }
}
