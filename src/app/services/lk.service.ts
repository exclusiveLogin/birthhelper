import {Injectable} from '@angular/core';
import {RestService} from './rest.service';
import {User} from '../models/user.interface';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {Permission} from '../models/lk.permission.interface';
import {shareReplay} from 'rxjs/operators';

export interface CTG {
    entId: number;
    entKey: string;
    color: string;
}

@Injectable({
    providedIn: 'root'
})
export class LkService {

    _availableContragents$ = new BehaviorSubject<CTG[]>([]);
    availableContragents$: Observable<CTG[]> = this._availableContragents$
        .pipe(shareReplay(1));

    _selectedContragents$ = new BehaviorSubject<CTG[]>([]);
    selectedContragents$: Observable<CTG[]> = this._selectedContragents$
        .pipe(shareReplay(1));

    constructor(
        private restService: RestService,
    ) {
    }
    getPermissionsByUser(user: User): Observable<Permission[]> {
        if (!user?.id) { return throwError('Не передан корректный пользователь'); }
        return this.restService.getEntityList('ent_lk_permissions', null, {user_id: user.id.toString()});
    }

    setAvailableContragents(ctgs: CTG[]): void {
        this._availableContragents$.next(ctgs);
    }

    setSelectedContragents(ctgs: CTG[]): void {
        this._availableContragents$.next(ctgs);
    }

    getContragentColor(ctg: CTG): string {
        return this._availableContragents$.value
            .find(_ => JSON.stringify(_) === JSON.stringify(ctg))?.color ?? '#ffffff';
    }
}
