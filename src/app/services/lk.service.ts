import {Injectable} from '@angular/core';
import {RestService} from './rest.service';
import {User} from '../models/user.interface';
import {BehaviorSubject, Observable, Subject, throwError} from 'rxjs';
import {Permission} from '../models/lk.permission.interface';
import {shareReplay, tap} from 'rxjs/operators';

export interface CTG {
    entId: number;
    color: string;
}

@Injectable({
    providedIn: 'root'
})
export class LkService {

    _ordersFilters$ = new Subject<any>();
    ordersFilters$: Observable<any> = this._ordersFilters$.pipe(
        shareReplay(1),
    );

    _availableContragents$ = new BehaviorSubject<CTG[]>([]);
    availableContragents$: Observable<CTG[]> = this._availableContragents$
        .pipe(shareReplay(1));

    _selectedContragents$ = new BehaviorSubject<CTG[]>([]);
    selectedContragents$: Observable<CTG[]> = this._selectedContragents$
        .pipe(shareReplay(1));

    constructor(
        private restService: RestService,
    ) {
        this.selectedContragents$.subscribe();
        this.availableContragents$.subscribe();
        this.ordersFilters$.subscribe();
    }
    getPermissionsByUser(user: User): Observable<Permission[]> {
        if (!user?.id) { return throwError('Не передан корректный пользователь'); }
        return this.restService.getEntityList('ent_lk_permissions', null, {user_id: user.id.toString()});
    }

    setAvailableContragents(ctgs: CTG[]): void {
        this._availableContragents$.next(ctgs);
    }

    setSelectedContragents(ctgs: CTG[]): void {
        this._selectedContragents$.next(ctgs);
    }

    getContragentColor(ctg: CTG): string {
        return this._availableContragents$.value
            .find(_ => JSON.stringify(_) === JSON.stringify(ctg))?.color ?? '#ffffff';
    }

    setFilters(filters: any): void {
        this._ordersFilters$.next(filters);
    }
}
