import { Injectable } from "@angular/core";
import { RestService } from "./rest.service";
import { User } from "../models/user.interface";
import { BehaviorSubject, Observable, Subject, throwError } from "rxjs";
import { Permission } from "../models/lk.permission.interface";
import { map, shareReplay, switchMap, tap } from "rxjs/operators";
import { uniq } from "@modules/utils/uniq";
import { AuthService } from "@modules/auth-module/auth.service";

export interface CTG {
    entId: number;
    color: string;
}

@Injectable({
    providedIn: "root",
})
export class LkService {
    _ordersFilters$ = new Subject<any>();
    _feedbackFilters$ = new Subject<any>();
    ordersFilters$: Observable<any> = this._ordersFilters$.pipe(shareReplay(1));
    feedbackFilters$: Observable<any> = this._feedbackFilters$.pipe(
        shareReplay(1)
    );

    _availableContragents$ = new BehaviorSubject<CTG[]>([]);
    availableContragents$: Observable<CTG[]> = this._availableContragents$.pipe(
        shareReplay(1)
    );

    _selectedContragents$ = new BehaviorSubject<CTG[]>([]);
    selectedContragents$: Observable<CTG[]> = this._selectedContragents$.pipe(
        shareReplay(1)
    );

    constructor(
        private restService: RestService,
        private authService: AuthService
    ) {
        this.selectedContragents$.subscribe();
        this.availableContragents$.subscribe();
        this.ordersFilters$.subscribe();
        this.feedbackFilters$.subscribe();
    }

    permissionsRaw$: Observable<Permission[]> = this.authService.user$.pipe(
        switchMap((user) => this.getPermissionsByUser(user)),
        tap((data) => console.log("getPermissionsByUser: ", data))
    );

    userHasLkPermissions$: Observable<boolean> = this.permissionsRaw$.pipe(
        map((permission) => !!permission?.length),
        tap((state) => console.log("userHasLkPermissions$", state))
    );
    permSections$: Observable<string[]> = this.permissionsRaw$.pipe(
        map((permissions) =>
            uniq(permissions.map((p) => p?.meta?.permission_id?.slug))
        )
    );
    getPermissionsByUser(user: User): Observable<Permission[]> {
        if (!user?.id) {
            return throwError("Не передан корректный пользователь");
        }
        return this.restService.getEntityList("ent_lk_permissions", null, {
            user_id: user.id.toString(),
        });
    }

    setAvailableContragents(ctgs: CTG[]): void {
        this._availableContragents$.next(ctgs);
    }

    setSelectedContragents(ctgs: CTG[]): void {
        this._selectedContragents$.next(ctgs);
    }

    getContragentColor(ctg: CTG): string {
        return (
            this._availableContragents$.value.find(
                (_) => JSON.stringify(_) === JSON.stringify(ctg)
            )?.color ?? "#ffffff"
        );
    }

    setFilters(lkSection: "order" | "feedback", filters: any): void {
        switch (lkSection) {
            case "order":
                this._ordersFilters$.next(filters);
                break;
            case "feedback":
                this._feedbackFilters$.next(filters);
        }
    }
}
