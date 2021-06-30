import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Entity} from 'app/models/entity.interface';
import {Clinic} from 'app/models/clinic.interface';
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

    listFetchers: { [key in EntityType]: any } = {
        clinics: this.clinicFetcherFactory.bind(this),
    };

    clinicFetcherFactory(page = 1): Observable<Clinic[]> {
        return this.rest.getEntityList('ent_clinics', page).pipe(
            filter(data => !!data),
            map(list => list.map(ent => Clinic.createClinicMini(ent))),
        );
    }

    getListProvider(type: EntityType): (page: number) => Observable<Entity[]> {
        return this.listFetchers[type];
    }
}
