import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Entity} from 'app/models/entity.interface';
import {Clinic, IClinicMini} from 'app/models/clinic.interface';
import {IRestParams, RestService} from 'app/services/rest.service';
import {filter, map} from 'rxjs/operators';
import {ISet} from '../Admin/entity.model';

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

    setFetchers = {
        clinics: this.clinicSetFetcherFactory.bind(this) as () => Observable<ISet>,
    };

    clinicFetcherFactory(page = 1): Observable<IClinicMini[]> {
        const qp: IRestParams = { active: '1' };
        return this.rest.getEntityList('ent_clinics', page, qp).pipe(
            filter(data => !!data),
            map(list => list.map(ent => Clinic.createClinicMini(ent))),
        );
    }

    clinicSetFetcherFactory(): Observable<IClinicMini[]> {
        const qp: IRestParams = { active: '1' };
        return this.rest.getEntitySet('ent_clinics', qp).pipe(
            filter(data => !!data),
        );
    }

    getListProvider(type: EntityType): (page: number) => Observable<Entity[]> {
        return this.listFetchers[type];
    }

    getSetProvider(type: EntityType): () => Observable<ISet> {
        return this.setFetchers[type];
    }
}
