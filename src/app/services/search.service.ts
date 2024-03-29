import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Entity } from "app/models/entity.interface";
import { Clinic, IClinicMini, IClinicSrc } from "app/models/clinic.interface";
import { IRestParams, RestService } from "app/services/rest.service";
import { filter, map } from "rxjs/operators";
import { ISet } from "../modules/admin/entity.model";
import { SearchFilterConfig, SearchSection } from "../models/filter.interface";
import { FilterResult } from "../modules/search/search/components/filter/filter.component";
import {
    Consultation,
    IConsultationMini,
    IConsultationSrc,
} from "@models/consultation.interface";

export type SectionType = "clinic" | "consultation";
export type FetchersSection<T> = {
    [key in SectionType]: (args?: any) => Observable<T>;
};

@Injectable({
    providedIn: "root",
})
export class SearchService {
    constructor(private rest: RestService) {}

    listFetchers: FetchersSection<IClinicMini[]> = {
        clinic: this.clinicFetcherFactory.bind(this),
        consultation: this.consultationFetcherFactory.bind(this),
    };

    setFetchers: FetchersSection<ISet> = {
        clinic: this.clinicSetFetcherFactory.bind(this),
        consultation: this.consultationSetFetcherFactory.bind(this),
    };

    filterFetchers: FetchersSection<SearchSection[]> = {
        clinic: this.clinicFilterFetcherFactory.bind(this),
        consultation: this.consultationFilterFetcherFactory.bind(this),
    };

    filterConfigFetchers: FetchersSection<SearchFilterConfig> = {
        clinic: this.clinicFilterConfigFetcherFactory.bind(this),
        consultation: this.consultationFilterConfigFetcherFactory.bind(this),
    };

    clinicFilterConfigFetcherFactory(
        hash: string
    ): Observable<SearchFilterConfig> {
        if (!hash) {
            return of(null);
        }
        return this.rest
            .getFilterConfigByHash("clinic", hash)
            .pipe(filter((data) => !!data));
    }

    clinicFilterFetcherFactory(): Observable<SearchSection[]> {
        return this.rest
            .getFilterConfig("clinic")
            .pipe(filter((data) => !!data));
    }

    clinicFetcherFactory(page = 1, hash?: string): Observable<IClinicMini[]> {
        const qp: IRestParams = { active: "1" };

        if (hash) {
            qp.hash = hash;
        }
        return this.rest
            .getEntityList<IClinicSrc>("ent_clinic_contragents", page, qp)
            .pipe(
                filter((data) => !!data),
                map((list) => list.map((ent) => Clinic.createClinicMini(ent)))
            );
    }

    clinicSetFetcherFactory(hash?: string): Observable<IClinicMini[]> {
        const qp: IRestParams = { active: "1" };
        if (hash) {
            qp.hash = hash;
        }
        return this.rest
            .getEntitySet("ent_clinic_contragents", qp)
            .pipe(filter((data) => !!data));
    }

    consultationFilterConfigFetcherFactory(
        hash: string
    ): Observable<SearchFilterConfig> {
        if (!hash) {
            return of(null);
        }
        return this.rest
            .getFilterConfigByHash("consultation", hash)
            .pipe(filter((data) => !!data));
    }

    consultationFilterFetcherFactory(): Observable<SearchSection[]> {
        return this.rest
            .getFilterConfig("consultation")
            .pipe(filter((data) => !!data));
    }

    consultationFetcherFactory(
        page = 1,
        hash?: string
    ): Observable<IConsultationMini[]> {
        const qp: IRestParams = { active: "1" };

        if (hash) {
            qp.hash = hash;
        }
        return this.rest
            .getEntityList<IConsultationSrc>(
                "ent_consultation_contragents",
                page,
                qp
            )
            .pipe(
                filter((data) => !!data),
                map((list) =>
                    list.map((ent) => Consultation.createConsultationMini(ent))
                )
            );
    }

    consultationSetFetcherFactory(hash?: string): Observable<IClinicMini[]> {
        const qp: IRestParams = { active: "1" };
        if (hash) {
            qp.hash = hash;
        }
        return this.rest
            .getEntitySet("ent_consultation_contragents", qp)
            .pipe(filter((data) => !!data));
    }

    getListProvider(
        type: SectionType
    ): (page: number, hash?: string) => Observable<Entity[]> {
        return this.listFetchers[type];
    }

    getSetProvider(type: SectionType): (hash?: string) => Observable<ISet> {
        return this.setFetchers[type];
    }

    getFilterProvider(type: SectionType): () => Observable<SearchSection[]> {
        return this.filterFetchers[type];
    }

    getFilterConfigProvider(
        type: SectionType
    ): (hash: string) => Observable<SearchFilterConfig> {
        return this.filterConfigFetchers[type];
    }

    getFilterHash(
        type: SectionType,
        filters: FilterResult
    ): Observable<string> {
        return this.rest.getHashBySearchSection(type, filters);
    }
}
