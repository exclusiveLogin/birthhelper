import { Injectable } from "@angular/core";
import { DictService, IDictItem } from "../dict.service";
import { IEntityItem, ISet } from "../entity.model";
import { Observable, of } from "rxjs";
import { ITableFilter } from "./table/table.component";
import { IRestParams } from "../rest.service";
import { EntityService } from "../entity.service";

@Injectable({ providedIn: "root" })
export class ProviderService {
    constructor(private dict: DictService, private entity: EntityService) {}

    public getItemsFirstPortion(
        key: string,
        type: string
    ): Observable<IEntityItem[] | IDictItem[]> {
        return type === "dict" ? this.getDictPage(key) : this.getEntPage(key);
    }

    public getItemPage(
        key: string,
        type: string,
        page: number = 1,
        queryParams: IRestParams = {}
    ): Observable<IEntityItem[] | IDictItem[]> {
        return type === "dict"
            ? this.getDictPage(key, page)
            : this.getEntPage(key, page, queryParams);
    }

    public getFilters(key: string, type: string): Observable<ITableFilter[]> {
        return type === "dict"
            ? this.getDictFilters(key)
            : this.getEntityFilters(key);
    }

    public getItemsSet(
        key: string,
        type: string,
        queryParams: IRestParams = {}
    ) {
        return type ? this.getEntSet(key, queryParams) : of(null);
    }

    public getDictPage(key: string, page: number = 1) {
        return this.dict.getDict(key, page);
    }

    public getFullDict(key: string) {
        return this.dict.getDict(key);
    }

    private getEntPage(key: string, page: number = 1, qp?: IRestParams) {
        return this.entity.getEnt(key, page, qp);
    }

    private getEntSet(key: string, qp?: IRestParams): Observable<ISet> {
        return this.entity.getEntSet(key, qp);
    }

    private getDictFilters(key: string): Observable<ITableFilter[]> {
        return of(null);
    }

    private getEntityFilters(key: string): Observable<ITableFilter[]> {
        return this.entity.getEntFilters(key);
    }
}
