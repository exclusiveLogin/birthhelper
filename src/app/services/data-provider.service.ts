import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

export type EntityType = 'clinics';

@Injectable({
    providedIn: 'root'
})
export class DataProviderService {

    constructor() {
    }

    getList(type: EntityType): Observable<any> {
        return;
    }
}
