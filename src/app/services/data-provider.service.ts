import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Entity} from 'app/models/entity.interface';
import {Clinic, IClinicMini} from 'app/models/clinic.interface';
import {IRestParams, RestService} from 'app/services/rest.service';
import {filter, map} from 'rxjs/operators';
import {ISet} from '../Admin/entity.model';
import {SearchFilterConfig, SearchSection} from '../models/filter.interface';
import {FilterResult} from '../search/search/components/filter/filter.component';

export type EntityType = 'clinic';
export type FetchersSection<T> = {
    [key in EntityType]?: (args?: any) => Observable<T>
};

@Injectable({
    providedIn: 'root'
})
export class DataProviderService {

    constructor(
        private rest: RestService,
    ) {
    }

    listFetchers: FetchersSection<IClinicMini[]> = {
        clinic: this.clinicFetcherFactory.bind(this),
    };

    setFetchers: FetchersSection<ISet> = {
        clinic: this.clinicSetFetcherFactory.bind(this),
    };

    filterFetchers: FetchersSection<SearchSection[]> = {
        clinic: this.clinicFilterFetcherFactory.bind(this),
    };

    filterConfigFetchers: FetchersSection<SearchFilterConfig> = {
        clinic: this.clinicFilterConfigFetcherFactory.bind(this),
    };

    clinicFilterConfigFetcherFactory(hash: string): Observable<SearchFilterConfig> {
        if (!hash) {
            return of(null);
        }
        return this.rest.getFilterConfigByHash('clinic', hash).pipe(
            filter(data => !!data),
        );
    }

    clinicFilterFetcherFactory(): Observable<SearchSection[]> {
        return this.rest.getFilterConfig('clinic').pipe(
            filter(data => !!data),
        );
    }

    clinicFetcherFactory(page = 1, hash?: string): Observable<IClinicMini[]> {
        const qp: IRestParams = {active: '1'};

        if (hash) {
            qp.hash = hash;
        }
        return this.rest.getEntityList('ent_clinics', page, qp).pipe(
            filter(data => !!data),
            map(list => list.map(ent => Clinic.createClinicMini(ent))),
        );
    }

    clinicSetFetcherFactory(hash?: string): Observable<IClinicMini[]> {
        const qp: IRestParams = {active: '1'};
        if (hash) {
            qp.hash = hash;
        }
        return this.rest.getEntitySet('ent_clinics', qp).pipe(
            filter(data => !!data),
        );
    }

    getListProvider(type: EntityType): (page: number, hash?: string) => Observable<Entity[]> {
        return this.listFetchers[type];
    }

    getSetProvider(type: EntityType): (hash?: string) => Observable<ISet> {
        return this.setFetchers[type];
    }

    getFilterProvider(type: EntityType): () => Observable<SearchSection[]> {
        return this.filterFetchers[type];
    }

    getFilterConfigProvider(type: EntityType): (hash: string) => Observable<SearchFilterConfig> {
        return this.filterConfigFetchers[type];
    }

    getFilterHash(type: EntityType, filters: FilterResult): Observable<string> {
        return this.rest.getHashBySearchSection(type, filters);
    }
}
