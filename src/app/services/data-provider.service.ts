import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Entity} from 'app/models/entity.interface';
import {Clinic, IClinicMini} from 'app/models/clinic.interface';
import {RestService} from 'app/services/rest.service';
import {filter, map} from 'rxjs/operators';

export type EntityType = 'clinics';

@Injectable({
    providedIn: 'root'
})
export class DataProviderService {

    constructor(
        private rest: RestService,
    ) {
    }

    listFetchers = {
        clinics: this.clinicFetcherFactory.bind(this) as (page: number) => Observable<IClinicMini[]>,
    };

    clinicFetcherFactory(page = 1): Observable<IClinicMini[]> {
        return this.rest.getEntityList('ent_clinics', page).pipe(
            filter(data => !!data),
            map(list => list.map(ent => Clinic.createClinicMini(ent))),
        );
    }

    getListProvider(type: EntityType): (page: number) => Observable<Entity[]> {
        return this.listFetchers[type];
    }
}
