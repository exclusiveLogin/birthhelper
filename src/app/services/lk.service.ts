import {Injectable} from '@angular/core';
import {RestService} from './rest.service';
import {User} from '../models/user.interface';
import {Observable, throwError} from 'rxjs';
import {Permission} from '../models/lk.permission.interface';

@Injectable({
    providedIn: 'root'
})
export class LkService {

    constructor(
        private restService: RestService,
    ) {
    }

    getPermissionsByUser(user: User): Observable<Permission[]> {
        if (!user?.id) { return throwError('Не передан корректный пользователь'); }
        return this.restService.getEntityList('ent_lk_permissions', null, {user_id: user.id.toString()});
    }
}
